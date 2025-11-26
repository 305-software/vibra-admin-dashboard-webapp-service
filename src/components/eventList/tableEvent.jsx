/**
 * TableEvent Component
 *
 * This component renders a table of events, allowing users to view, edit, and delete events.
 * It fetches event data from a Redux store and displays it in a structured format using the CustomTable component.
 * If no events are available, it shows a message indicating this. A modal is provided for confirming event deletions.
 *
 * @component
 * @example
 * return (
 *   <TableEvent selectedCategory="Music" calender={new Date()} />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - useEffect: Hook for performing side effects in function components.
 * - useState: Hook for managing local state in function components.
 * - useDispatch: Hook to access the Redux dispatch function.
 * - useSelector: Hook to access the Redux store state.
 * - useNavigate: Hook for programmatic navigation.
 * - ToastContainer: Component for displaying toast notifications.
 * - deleteEventSliceDetails: Redux action for deleting an event.
 * - eventListDetails: Redux action for fetching event details.
 * - Button: A custom button component.
 * - Card: A custom card component for layout.
 * - CustomModal: A custom modal component for displaying confirmation dialogs.
 * - CustomTable: A custom table component for displaying tabular data.
 *
 * @props
 * - selectedCategory (string): The category of events to filter.
 * - calender (Date): The date object used for fetching events.
 *
 * @state
 * - showModal (boolean): State to control the visibility of the confirmation modal.
 * - selectedEventId (string|null): Holds the ID of the event selected for deletion.
 *
 * @returns {JSX.Element} The rendered TableEvent component displaying a table of events or a message if no events are available.
 *
 * @logic
 * - Fetches event data based on the selected category and calendar date using Redux when the component mounts or when dependencies change.
 * - Flattens the event data to prepare it for display in the table, including serial number, event details, and action buttons.
 * - Provides functions to handle editing and deleting events, showing a modal for confirmation before deletion.
 * - Displays a toast notification for user feedback on actions.
 * - Renders the CustomTable component with the event data and headers, or a message if no events are available.
 */




import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { deleteEventSliceDetails, eventListDetails } from "../../redux/eventSlice";
import * as constant from "../../utlis/constant";
import FormattedDate from "../../utlis/date";
import Button from '../button/button';
import Card from '../card/tableCard';
import CustomModal from '../modal/Modal';
import CustomTable from '../table/analyticsTable';


const TableEvent = ({ selectedCategory, calender }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const dispatch = useDispatch();
  const {eventList:data , loading } = useSelector((state) => state.eventSlice) || [];
  const { t } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(eventListDetails(selectedCategory, calender));
    };

    fetchData();
  }, [dispatch, selectedCategory, calender]);

  const flattenedData = data.flatMap((event, index) => ({
    [t("SNO")]: index + 1,
    [constant.ID]: event._id,
    [t("NAME")]: event.eventName,
    [t("DATE")]:<FormattedDate date={event.eventDate} />, 
    [t("TIME")]: event.eventTime,
    [t("CATEGORY")]: event.categoryName,
    [t("LOCATION")]: (
      <div className={`event-location-table`}>
        {event.location}
      </div>
    ),
    [t("SEATS")]: event.totalSeats,
    [constant.CAN_EDIT]: true,
    [constant.CAN_DELETE]: true,
    [t("PRICE")]: <span style={{ color: 'black', fontWeight: 700, whiteSpace: 'nowrap', flex: 1 }}>${event.price.toLocaleString('en-US')}</span>,

  }));

  const onEdit = (row) => {
    
    navigate(`/eventList/createEvent/${row.id}`);
  };

  const onDelete = (row) => {
    setSelectedEventId(row.id);
    setShowModal(true); // Show the modal
  };
 
  const headers = [
    t("SNO"),
    t("NAME"),
    t("DATE"),
    t("TIME"),
    t("CATEGORY"),
    t("LOCATION"),
    t("SEATS"), 
    t("PRICE"),
    t("ACTIONS"),
  
  ];

  const confirmDelete = async () => {
    if (selectedEventId) {
     const response= await dispatch(deleteEventSliceDetails(selectedEventId)).unwrap();
     if(response.status===200){
      toast.success(t("EVENT_DELETED_SUCCESSFULLY"), {
        display: 'flex',
        toastId: 'user-action',
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        toastClassName: 'custom-toast',
        bodyClassName: 'custom-toast',
    });
     }
       
      await dispatch(eventListDetails(selectedCategory, calender)); // Fetch updated list
      setShowModal(false); // Close the modaqal
      setSelectedEventId(null); // Reset selected ID
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedEventId(null); // Reset selected ID
  };



  return (
    <div className='mb-4'>
      <Card loading={loading}>

        {flattenedData.length > 0 ? (
          <CustomTable
            headers={headers}
            data={flattenedData}
            rowsPerPage={5}
            featureName={constant.EVENT}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <div className="no-transactions event-height ">
            <p>{t("NO_EVENTS_AVAILABLE")}</p>
          </div>
        )}

        {/* Custom Modal for Confirmation */}
        <CustomModal
          show={showModal}
          handleClose={handleClose}
          handleConfirm={confirmDelete}
          body={
            <div>
              <h3 className='mb-3'>{t("DELETE")}</h3>
              <h5>{t("ARE_YOU_SURE_YOU_WANT_TO_DELETE")}</h5>
              <div className='d-flex justify-content-end gap-2 mt-3'>
                <Button name={t("CANCEL")} style={{ backgroundColor: "#6c757d", color: "white" }} onClick={handleClose} />
                <Button style={{ backgroundColor: "rgb(231, 28, 28)", color: "white" }} name={t("DELETE")} onClick={confirmDelete} />
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default TableEvent;
