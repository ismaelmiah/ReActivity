import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivityFormValues, ActivityFormValues } from "../../../App/Models/Activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../App/Stores/ActivityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../App/common/form/TextInput";
import TextAreaInput from "../../../App/common/form/TextAreaInput";
import SelectInput from "../../../App/common/form/SelectInput";
import { category } from "../../../App/common/options/categoryOptions";
import DateInput from "../../../App/common/form/DateInput";
import { combineDateAndTime } from "../../../App/common/util/util";
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';

const validate = combineValidators({
  title: isRequired({message: 'The event Title is Required'}),
  category: isRequired('Category'),
  description: composeValidators(
      isRequired('Description'),
      hasLengthGreaterThan(4)({
        message: 'Description needs to be at least 5 characters'
      })
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
})



interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity,
  } = activityStore;

  const [activity, setActivity] = useState<IActivityFormValues>(new ActivityFormValues());
  const [, setLoading] = useState(false);
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id).then(
        (activity) => setActivity(new ActivityFormValues(activity))
      ).finally(() => {
        setLoading(false);
      });
    }
  }, [
    loadActivity,
    match.params.id,
  ]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const {date, time, ...activity} = values;
    activity.date = dateAndTime;
    if(!activity.id){
        let newActivity = {
            ...activity,
             id: uuid()
        }
        createActivity(newActivity);
    }else{
        editActivity(activity);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
          validate={validate}
          initialValues = {activity}
            onSubmit={handleFinalFormSubmit}
            render={({handleSubmit, invalid, pristine}) => (
              <Form onSubmit={handleSubmit}>
                <Field
                  placeholder="Title"
                  name="title"
                  value={activity.title}
                  component={TextInput}
                />

                <Field
                  placeholder="Description"
                  name="description"
                  rows={3}
                  value={activity.description}
                  component={TextAreaInput}
                />

                <Field
                  placeholder="Category"
                  name="category"
                  options={category}
                  value={activity.category}
                  component={SelectInput}
                />

                <Form.Group widths={"equal"}>
                  <Field
                    placeholder="Date"
                    name="date"
                    date={true}
                    value={activity.date}
                    component={DateInput}
                  />

                  <Field
                    placeholder="Time"
                    name="time"
                    time={true}
                    value={activity.time}
                    component={DateInput}
                  />
                </Form.Group>

                <Field
                  placeholder="City"
                  name="city"
                  value={activity.city}
                  component={TextInput}
                />

                <Field
                  placeholder="Venue"
                  name="venue"
                  value={activity.venue}
                  component={TextInput}
                />

                <Button.Group widths={2}>
                  <Button
                    disabled={invalid || pristine}
                    floated="right"
                    positive
                    type="submit"
                    content="Submit"
                    loading={submitting}
                  />
                  <Button
                    onClick={
                      activity.id 
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push("/activities")}
                    floated="right"
                    color="red"
                    content="Cancel"
                  />
                </Button.Group>
                </Form>
            )}
            />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
