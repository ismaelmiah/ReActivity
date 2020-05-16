import React, { useState, FormEvent } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../App/Models/Activity'
import {v4 as uuid} from 'uuid';

interface IProps{
    setEditmode: (editmode: boolean) => void;
    activity: IActivity;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
}

export const ActivityForm: React.FC<IProps> = ({setEditmode, activity: initialActivityFormState, createActivity, editActivity}) => {

    const InitializedForm = () => {
        if(initialActivityFormState){
            return initialActivityFormState
        }
        else{
            return{
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            }
        }
    }

    const[activity, setActivity] = useState<IActivity>(InitializedForm)

    const handleSubmit = () => {
        console.log(activity);
        if(activity.id.length === 0){
            let newActivity = {
                ...activity, id: uuid()
            }
            createActivity(newActivity);
        }else{
            editActivity(activity);
        }
    }

    const handleInputChange = (event:FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(event.currentTarget.value);
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
    }
    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input
                 placeholder='Title'
                 name='title'
                 value={activity.title}
                  onChange={handleInputChange} />

                <Form.TextArea rows={2}
                 placeholder='Description'
                 name='description' 
                 value={activity.description}
                  onChange={handleInputChange} />
                
                <Form.Input
                 placeholder='Category'
                 name='category'
                  value={activity.category}
                  onChange={handleInputChange} />
                
                <Form.Input type='datetime-local'
                 placeholder='Date'
                 name='date'
                  value={activity.date}
                  onChange={handleInputChange} />
                
                <Form.Input
                 placeholder='City'
                name='city'
                 value={activity.city}
                  onChange={handleInputChange} />
                
                <Form.Input 
                placeholder='Venue'
                name='venue' 
                value={activity.venue}
                onChange={handleInputChange}/>
                
                <Button.Group widths={2}>
                    <Button floated='right' positive type='submit' content='Submit' />
                    <Button onClick={() => setEditmode(false)} floated='right' color='red' content='Cancel' />
                </Button.Group>
            </Form>
        </Segment>
    )
}
