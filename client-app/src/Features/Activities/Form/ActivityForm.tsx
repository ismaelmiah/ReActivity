import React, { useState, FormEvent, useContext, useEffect } from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { IActivity } from '../../../App/Models/Activity'
import {v4 as uuid} from 'uuid';
import ActivityStore from '../../../App/Stores/ActivityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';

interface DetailParams{
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {
    const activityStore = useContext(ActivityStore);
    const {
        createActivity, 
        editActivity, 
        submitting, 
        Activity: initialFormState,
        loadActivity,
        clearActivity} = activityStore;

    const[activity, setActivity] = useState<IActivity>({   
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });
    
    useEffect(() => {
        if(match.params.id && activity.id.length === 0) {
            loadActivity(match.params.id).then(() => initialFormState && setActivity(initialFormState));
        }
        return (() => {
            clearActivity();
        })
    }, [loadActivity, match.params.id, clearActivity, initialFormState, activity.id.length])
    
    const handleSubmit = () => {
        //console.log(activity);
        if(activity.id.length === 0){
            let newActivity = {
                ...activity, id: uuid()
            }
            createActivity(newActivity).then(() => {
                history.push(`/activities/${newActivity.id}`);
            });
        }else{
            editActivity(activity).then(() => {
                history.push(`/activities/${activity.id}`);
            });
        }
    }

    const handleInputChange = (event:FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //console.log(event.currentTarget.value);
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
    }
    return (
        <Grid>
            <Grid.Column width={10}>
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
                            <Button 
                            floated='right' 
                            positive type='submit' 
                            content='Submit' 
                            loading={submitting} />
                            <Button onClick={() => history.push('/activities')} floated='right' color='red' content='Cancel' />
                        </Button.Group>
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityForm);