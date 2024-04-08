import {Button, Card} from "react-bootstrap";

export const TodoViewCard = ({}) => {
    return(
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" alt={"todo list card image"} />
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the cards content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
    )
}