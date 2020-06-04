import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityStore from '../../../App/Stores/ActivityStore';
import {observer} from 'mobx-react-lite';
import { RouteComponentProps, Link } from 'react-router-dom';
import LoadingComponent from '../../../App/Layout/Loader/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

interface Detail{
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<Detail>> = ({match, history}) => {
    const activityStore = useContext(ActivityStore);
    const {Activity, loadActivity, loadingInitial} = activityStore;
    
    useEffect(() => {
        loadActivity(match.params.id)
    }, [loadActivity, match.params.id])
    
    if(loadingInitial || !Activity) return <LoadingComponent content='Loading Activity....' />
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity = {Activity} />
                <ActivityDetailedInfo activity = {Activity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDetails);
