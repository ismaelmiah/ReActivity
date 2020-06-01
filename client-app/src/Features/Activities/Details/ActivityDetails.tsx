import React, { useContext, useEffect } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import ActivityStore from '../../../App/Stores/ActivityStore';
import {observer} from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../../App/Layout/Loader/LoadingComponent';

interface Detail{
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<Detail>> = ({match, history}) => {
    const activityStore = useContext(ActivityStore);
    const {Activity, openEditForm, cancelSelectedActivity, loadActivity, loadingInitial} = activityStore;
    
    useEffect(() => {
        loadActivity(match.params.id)
    }, [loadActivity])
    
    if(loadingInitial || !Activity) return <LoadingComponent content='Loading Activity....' />
    return (
        <Card fluid>
            <Image src={`/items/categoryImages/${Activity!.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{Activity!.title}</Card.Header>
                <Card.Meta>
                    <span>{Activity!.date}</span>
                </Card.Meta>
                <Card.Description>
                    {Activity!.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button onClick={() => openEditForm(Activity!.id)} color='blue' content='Edit' basic />
                    <Button onClick={ () => history.push('/activities')} content='Cancel' basic color='grey'/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default observer(ActivityDetails);
