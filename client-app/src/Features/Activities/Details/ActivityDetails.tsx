import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import {observer} from 'mobx-react-lite';
import { RouteComponentProps} from 'react-router-dom';
import LoadingComponent from '../../../App/Layout/Loader/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';
import { RootStoreContext } from '../../../App/Stores/rootStore';

interface Detail{
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<Detail>> = ({match, history}) => {
    const rootStore = useContext(RootStoreContext);
    const {Activity, loadActivity, loadingInitial} = rootStore.activityStore;
    
    useEffect(() => {
        loadActivity(match.params.id).catch(() => {
            history.push('/notfound');
        })
    }, [loadActivity, match.params.id, history])
    
    if(loadingInitial) return <LoadingComponent content='Loading Activity....' />
    if(!Activity){
        return <h1>Activity Not Found</h1>
    }
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity = {Activity} />
                <ActivityDetailedInfo activity = {Activity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar attendees={Activity.Attendees} />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDetails);
