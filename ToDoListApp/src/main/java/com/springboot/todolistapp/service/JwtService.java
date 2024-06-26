package com.springboot.todolistapp.service;

import com.springboot.todolistapp.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtService {

    private final TokenRepository tokenRepository;

    private final RefreshTokenService refreshTokenService;


    @Value("${service.secretKey}")
    private String secretKey;
    public String generateToken(UserDetails user){

        return Jwts.builder()
                .subject(user.getUsername())
                .expiration(new Date(System.currentTimeMillis() + 1000*60*5))
                .issuedAt(new Date(System.currentTimeMillis()))
                .signWith(getSigningKey())
                .compact();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims extractAllClaims(String jwt){
        return Jwts
                .parser()
                .verifyWith(getSigningKey())
                .build()
                 .parseSignedClaims(jwt)
                .getPayload();
    }

    public String extractUserName(String jwt){
        return extractClaim(Claims::getSubject, jwt);
    }

    private Date extractExpirationDate(String jwt){
        return extractClaim(Claims::getExpiration, jwt);
    }

    private <T> T extractClaim(Function<Claims, T> claimExtractor, String jwt){
        Claims claims = extractAllClaims(jwt);
        return claimExtractor.apply(claims);
    }

    private Boolean isExpired(String jwt){
        return (extractExpirationDate(jwt).compareTo(new Date(System.currentTimeMillis())) < 0);
    }

    public Boolean isValid(String jwt, UserDetails userDetails){

        log.warn("checking jwt validity");
        String username = (extractUserName(jwt));

        boolean isTokenValid = tokenRepository.findByToken(jwt).
                map(t -> !t.getIsLoggedOut()).orElse(false);

        return (username.equals(userDetails.getUsername())  && isTokenValid && isExpired(jwt));

    }

}
