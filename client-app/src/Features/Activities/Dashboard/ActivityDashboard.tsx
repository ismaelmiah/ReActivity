import React, { useContext, useEffect, useState } from "react";
import { Grid, GridColumn, Button, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../App/Layout/Loader/LoadingComponent";
import { RootStoreContext } from "../../../App/Stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ActivityFilters from "./ActivityFilters";

const ActivityDashboard = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    loadingInitial,
    setPage,
    page,
    totalPages,
  } = rootStore.activityStore;

  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingInitial) {
    return <LoadingComponent content="Loading Activities" />;
  }
  return (
    <Grid>
      <GridColumn width={10}>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!loadingNext && (page + 1 < totalPages)}
          initialLoad={false}
        >
          <ActivityList />
        </InfiniteScroll>
      </GridColumn>
      <GridColumn width={6}>
        <ActivityFilters/>
      </GridColumn>
      <GridColumn width={10}>
        <Loader active={loadingNext} />
      </GridColumn>
    </Grid>
  );
};

export default observer(ActivityDashboard);
