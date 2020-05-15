import React from 'react'
import { Grid, GridColumn, List } from 'semantic-ui-react';
import { IActivity } from '../../../App/Models/Activity';
import ActivityList from './ActivityList';

interface IProps{
    activities: IActivity[]
}

const ActivityDashboard: React.FC<IProps> = ({activities}) => {
    return (
      <Grid>
          <GridColumn width={10}>
                {/* <List>
                    {activities.map((activity) => (
                      <List.Item key={activity.id}>{activity.title}</List.Item>
                    ))}
                </List> */}
                <ActivityList activities = {activities} />
          </GridColumn>
      </Grid>  
    );
};

export default ActivityDashboard
