import React, {useContext} from 'react'
import { Item, Label, Button, Segment, Icon} from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import ActivityStore from '../../../App/Stores/ActivityStore';
import { IActivity } from '../../../App/Models/Activity';

const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {
    const activityStore = useContext(ActivityStore);
    const {deleteActivity, target, submitting} = activityStore;

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/items/user.png' />
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                Hosted By Bob
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
                </Segment>
                <Segment>
                    <Icon name='clock' /> {activity.date}
                    <Icon name='marker' /> {activity.venue}, {activity.city}
                </Segment>
                <Segment secondary>Attendees will go here</Segment>
                <Segment clearing>
                    <span>{activity.description}</span>
                    <Button
                        as={Link} to={`/activities/${activity.id}`}
                        floated='right'
                        content='View'
                        color='black' />
                </Segment>
        </Segment.Group>
    )
}

export default ActivityListItem
