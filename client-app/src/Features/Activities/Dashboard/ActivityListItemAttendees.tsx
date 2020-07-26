import React from "react";
import { IAttendee } from "../../../App/Models/Activity";
import { List, Popup, Image } from "semantic-ui-react";

interface IProps {
  attendees: IAttendee[];
}

const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees &&
        attendees.map((attendee) => (
          <List.Item key={attendee.username}>
            <Popup
              header={attendee.displayName}
              trigger={
                <Image
                  size="mini"
                  circular
                  src={attendee.image || `/items/user.png`}
                />
              }
            />
          </List.Item>
        ))}
    </List>
  );
};

export default ActivityListItemAttendees;
