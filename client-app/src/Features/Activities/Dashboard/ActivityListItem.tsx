import React from 'react'
import { Item, Button, Segment, Icon} from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { IActivity } from '../../../App/Models/Activity';

const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {

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
