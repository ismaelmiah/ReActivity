import React, { useContext } from "react";
import { Button, Header, Image, Item, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { IActivity } from "../../../App/Models/Activity";
import { RootStoreContext } from "../../../App/Stores/rootStore";

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
};

const ActivityDetailedHeader: React.FC<{ activity: IActivity }> = ({
  activity,
}) => {
  const rootStore = useContext(RootStoreContext);

  const {
    cancelActivity,
    attendActivity,
    loading,
    loadingInitial,
  } = rootStore.activityStore;

  if (loadingInitial) {
    return <div>Loading...</div>;
  }

  const attendees = activity.attendees ?? [];
  const host = attendees.find((a) => a.isHost);

  if (!host) {
    return <div>Loading...</div>;
  }

  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image
          src={`/images/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />

        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                <p style={{ color: "white" }}>
                  {format(activity.date, "eeee do MMMM")}
                </p>
                <p style={{ color: "white" }}>
                  Hosted by{" "}
                  <Link to={`/profile/${host.username}`}>
                    <strong>{host.displayName}</strong>
                  </Link>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <Button
            as={Link}
            to={`/manage/${activity.id}`}
            color="orange"
            floated="right"
          >
            Manage Event
          </Button>
        ) : activity.isGoing ? (
          <Button loading={loading} onClick={cancelActivity}>
            Cancel attendance
          </Button>
        ) : (
          <Button
            loading={loading}
            onClick={attendActivity}
            color="teal"
          >
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityDetailedHeader);
