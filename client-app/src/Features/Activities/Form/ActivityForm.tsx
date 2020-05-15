import React from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'

interface IProps{
    setEditmode: (editmode: boolean) => void;
}

export const ActivityForm: React.FC<IProps> = ({setEditmode}) => {
    return (
        <Segment>
            <Form>
                <Form.Input placeholder='Title' />
                <Form.TextArea rows={2} placeholder='Description' />
                <Form.Input placeholder='Category' />
                <Form.Input type='date' placeholder='Date' />
                <Form.Input placeholder='City' />
                <Form.Input placeholder='Venue' />
                <Button.Group widths={2}>
                    <Button floated='right' positive type='submit' content='Submit' />
                    <Button onClick={() => setEditmode(false)} floated='right' color='red' content='Cancel' />
                </Button.Group>
            </Form>
        </Segment>
    )
}
