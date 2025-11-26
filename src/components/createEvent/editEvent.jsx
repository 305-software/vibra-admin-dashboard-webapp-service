/**
 * CreateEvent Component
 *
 * This component allows users to create or edit an event, including details about the event itself
 * and any associated speakers. It integrates with Redux for state management and uses React-Bootstrap
 * for styling and layout.
 *
 * @component
 * @example
 * return (
 *   <CreateEvent />
 * )
 *
 * @imports
 * - `react-toastify/dist/ReactToastify.css`: CSS for toast notifications.
 * - React, { useEffect, useRef, useState }: React hooks for managing component state and lifecycle.
 * - Col, Container, Form, Row: Bootstrap components for layout.
 * - useDispatch, useSelector: Redux hooks for dispatching actions and selecting state.
 * - useNavigate, useParams: React Router hooks for navigation and route parameters.
 * - toast, ToastContainer: Components for displaying toast notifications.
 * - CreateEventById, editcreateEventDetails, eventCategoryDetails: Redux actions for event management.
 * - Button, Card, CustomInput, CustomTextArea, CustomTable: Custom components used in the form.
 *
 * @state
 * - formValues: Object containing the event details.
 * - speakers: Array of speaker objects.
 * - currentSpeaker: Object representing the currently edited speaker.
 * - error: Object for form validation errors.
 * - locationSuggestions: Array of suggested locations based on user input.
 * - inputValue: Current value of the location input.
 * - editingSpeakerIndex: Index of the speaker being edited.
 * - imagePreview: URL for the preview of the speaker's image.
 * - loading: Boolean indicating whether the form submission is in progress.
 *
 * @methods
 * - handleLocationChange: Fetches location suggestions based on user input.
 * - handleLocationSelect: Updates form values with the selected location.
 * - handleChange: Updates form values and handles image preview for event image.
 * - handleSpeakerChange: Updates the current speaker's details and manages image preview.
 * - useEffect: Fetches event categories and event details if editing an existing event.
 * - addSpeaker: Adds a new speaker to the list if all fields are filled.
 * - updateSpeaker: Updates an existing speaker's details or adds a new one.
 * - handleSubmit: Validates and submits the form data to create or edit an event.
 * - validate: Checks for required fields and sets error messages.
 * - handleEditSpeaker: Prepares the form for editing an existing speaker.
 * - removeSpeaker: Removes a speaker from the list.
 *
 * @returns {JSX.Element} The rendered CreateEvent component.
 */


import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import config from "../../config"
import { CreateEventById, editcreateEventDetails, eventCategoryDetails } from "../../redux/eventSlice";
import * as constant from "../../utlis/constant";
import Button from '../button/button';
import Card from '../card/card';
import HeadCard from "../card/HeaderCard"
import CustomInput from '../customInput/customInput';
import CustomTextArea from '../customInput/customTextArea';
import CustomTable from '../table/speakerEventTable';
const headers = ['Speaker Name', 'Speaker Type', 'Speaker Image', 'Action'];

const CreateEvent = () => {
    const initialFormValues = {
        eventId: '',
        eventName: '',
        eventDescription: '',
        location: '',
        eventTime: '',
        eventDate: '',
        price: '',
        lat: '',
        long: '',
        eventType: '',
        totalSeats: '',
        eventGuideline: '',
        imageUrl: null,
    };

    const initialSpeakerValues = {
        speakerName: '',
        speakerType: '',
        speakerImage: '',
    };

    const navigate = useNavigate();
    const [formValues, setFormValues] = useState(initialFormValues);
    const [speakers, setSpeakers] = useState([]);
    const [currentSpeaker, setCurrentSpeaker] = useState(initialSpeakerValues);
    const [error, setError] = useState({});
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.eventSlice.eventCategory) || [];
    const createEventById = useSelector((state) => state.eventSlice.createEventById) || [];
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const { id } = useParams();
    const fileInputRef = useRef(null);
    const [editingSpeakerIndex, setEditingSpeakerIndex] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false); // Added loading state
    const { t } = useTranslation();

    const handleLocationChange = async (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim()) {
            try {
                const response = await fetch(
                    `https://api.locationiq.com/v1/autocomplete?key=${import.meta.env.REACT_APP_GOOGLE_API_KEY}&q=${encodeURIComponent(value)}&format=json`
                );

                if (!response.ok) {
                    throw new Error(t("FAIL_TO_FETCH_THE_LOCATION"));
                }

                const data = await response.json();
                setLocationSuggestions(data);
            } catch (error) {
                console.error("Error fetching location suggestions:", error.message);
            }
        } else {
            setLocationSuggestions([]);
        }
    };

    const handleLocationSelect = (place) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            location: place.display_name,
            lat: place.lat,
            long: place.lon,
        }));
        setInputValue(place.display_name); // Set the input value to the selected location
        setLocationSuggestions([]);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

         
        let processedValue = value;
        
        // Apply time formatting only for eventTime field
        if (name === 'eventTime' && value) {
          processedValue = value.substring(0, 5); // Remove seconds
        }
      
        setFormValues((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : processedValue,
        }));

        // Preview the new uploaded image
        if (name === "imageUrl" && type === "file" && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();

            reader.onload = () => {
                setFormValues((prev) => ({
                    ...prev,
                    imageUrlPreview: reader.result,
                }));
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSpeakerChange = (e) => {
        const { name, value, files } = e.target;
        if (name === constant.SPEAKERIMAGE) {
            if (files.length > 0) {
                const file = files[0];
                setCurrentSpeaker((prev) => ({
                    ...prev,
                    speakerImage: file
                }));

                // Create image preview
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            setCurrentSpeaker((prev) => ({ ...prev, [name]: value }));
        }
    };


    useEffect(() => {
        dispatch(eventCategoryDetails());
        if (id) {
            dispatch(CreateEventById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (createEventById && createEventById._id) {
            setFormValues({
                eventId: createEventById.eventId || '',
                eventName: createEventById.eventName || '',
                eventDescription: createEventById.eventDescription || '',
                location: createEventById.location || '',
                eventTime: createEventById.eventTime || '',
                eventDate: createEventById.eventDate ? createEventById.eventDate.split('T')[0] : '',
                price: createEventById.price || '',
                lat: createEventById.lat || '',
                long: createEventById.long || '',
                eventType: createEventById.eventType || '',
                totalSeats: createEventById.totalSeats || '',
                eventGuideline: createEventById.eventGuideline || '',
                imageUrl: createEventById.imageUrl || ''
            });
            setInputValue(createEventById.location || ''); // Set the input value for location
            const newSpeakers = createEventById.speakers.map(event => ({
                speakerName: event.speakerName || '',
                speakerType: event.speakerType || '',
                speakerImage: event.speakerImage || null,
            }));

            if (newSpeakers.length > 0) {
                setSpeakers(newSpeakers);
            }
        }
    }, [createEventById]);

    const addSpeaker = () => {
        if (currentSpeaker.speakerName &&
            currentSpeaker.speakerType &&
            currentSpeaker.speakerImage) {

            setSpeakers(prevSpeakers => [...prevSpeakers, currentSpeaker]);
            setCurrentSpeaker(initialSpeakerValues);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setImagePreview(null);
        } else {
            alert(t("PLEASE_FILL_ALL_THE_SPEAKER_FIELD"));
        }
    };


    const updateSpeaker = () => {
        if (currentSpeaker.speakerName &&
            currentSpeaker.speakerType &&
            currentSpeaker.speakerImage) {
            if (editingSpeakerIndex !== null) {
                const updatedSpeakers = [...speakers];
                updatedSpeakers[editingSpeakerIndex] = currentSpeaker;
                setSpeakers(updatedSpeakers);

                // Reset states
                setEditingSpeakerIndex(null);
                setCurrentSpeaker(initialSpeakerValues);
                setImagePreview(null);

                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                addSpeaker();
            }
        } else {
            alert(t("PLEASE_FILL_ALL_THE_SPEAKER_FIELD"));
        }
    };

    // Modify the speaker action button
    const speakerActionButton = editingSpeakerIndex !== null
        ? <Button type="button" name={t("UPDATE_SPEAKER")} onClick={updateSpeaker} />
        : <Button type="button" name={t("ADD_MORE_SPEAKER")} onClick={addSpeaker} />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            const formData = new FormData();
            Object.keys(formValues).forEach(key => {
                formData.append(key, formValues[key]);
            });
            speakers.forEach((speaker, index) => {
                // Append speaker name and type
                formData.append(`speakers[${index}][speakerName]`, speaker.speakerName);
                formData.append(`speakers[${index}][speakerType]`, speaker.speakerType);

                // Specifically handle speaker image
                if (speaker.speakerImage) {
                    // Check if it's a File object
                    if (speaker.speakerImage instanceof File) {
                        formData.append(`speakers[${index}][speakerImage]`, speaker.speakerImage);
                    } else if (typeof speaker.speakerImage === 'string') {
                        // If it's already a string path from previous upload, keep it
                        formData.append(`speakers[${index}][speakerImage]`, speaker.speakerImage);
                    }
                }
            });

            const data = {
                id: id,
                formData: formData
            }

            try {
                const response = await dispatch(editcreateEventDetails(data)).unwrap();
              
                if (response && response.status === 200) {
                    toast.success(t("EVENT_UPDATED_SUCCESSFULLY"), {
                        display: 'flex',
                        toastId: 'user-action',
                        autoClose: 2000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        toastClassName: 'custom-toast',
                        bodyClassName: 'custom-toast',
                    });
    
                    setTimeout(() => {
                        navigate('/eventList'); // Navigate on success
                    }, 2000);
                }
            } catch (err) {
                toast.error(err.message, {
                    display: 'flex',
                    toastId: 'user-action',
                    autoClose: 2000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    toastClassName: 'custom-toast',
                    bodyClassName: 'custom-toast',
                });
            } finally {
                setLoading(false); // End loading
            }

        }
    };

    const validate = () => {
        const error = {};
        let isFormValid = true;

        if (!formValues.eventId || formValues.eventId === "") {
            isFormValid = false;
            error.eventId = t("PLEASE_ENTER_THE_EVENT_CATEGORY");
        }
        if (!formValues.eventName || formValues.eventName === "") {
            isFormValid = false;
            error.eventName = t("PLEASE_ENTER_THE_EVENT_NAME");
        }
        if (!formValues.eventDescription || formValues.eventDescription === "") {
            isFormValid = false;
            error.eventDescription = t("PLEASE_ENTER_THE_EVENT_SUBSCRIPTION");
        }
        if (!formValues.location || formValues.location === "") {
            isFormValid = false;
            error.location = t("PLEASE_ENTER_THE_CONSTANT");
        }
        if (!formValues.eventDate || formValues.eventDate === "") {
            isFormValid = false;
            error.eventDate = t("PLEASE_ENTER_THE_EVENTDATE");
        }
        if (!formValues.eventTime || formValues.eventTime === "") {
            isFormValid = false;
            error.eventTime = t("PLEASE_ENTER_THE_EVENTTIME");
        }
        if (!formValues.price || formValues.price === "") {
            isFormValid = false;
            error.price = t("PLEASE_ENTER_THE_EVENTPRICE");
        }
        if (!formValues.eventType || formValues.eventType === "") {
            isFormValid = false;
            error.eventType = t("PLEASE_ENTER_THE_EVENTTYPE");
        }
        if (!formValues.totalSeats || formValues.totalSeats === "") {
            isFormValid = false;
            error.totalSeats = t("PLEASE_ENTER_THE_TOTALSEATS");
        }
        if (!formValues.eventGuideline || formValues.eventGuideline === "") {
            isFormValid = false;
            error.eventGuideline = t("PLEASE_ENTER_THE_EVENT_GUIDELINES");
        }
        if (!formValues.imageUrl) {
            isFormValid = false;
            error.imageUrl = t("PLEASE_CHOOSE_THE_IMAGE");
        }

        setError(error);
        return isFormValid;
    }


    const handleEditSpeaker = (speaker, index) => {
        // Set the current speaker to the one being edited
        setCurrentSpeaker({
            speakerName: speaker.speakerName,
            speakerType: speaker.speakerType,
            speakerImage: speaker.speakerImage
        });

        // Set image preview if speaker has an existing image
        if (speaker.speakerImage) {
            // If it's a string (from server), use config.imageUrl
            // If it's a File object, use URL.createObjectURL
            setImagePreview(
                typeof speaker.speakerImage === 'string'
                    ? `${speaker.speakerImage}`
                    : URL.createObjectURL(speaker.speakerImage)
            );
        }

        // Set the editing index
        setEditingSpeakerIndex(index);
    };

    const removeSpeaker = (index) => {
        setSpeakers((prevSpeakers) => prevSpeakers.filter((_, i) => i !== index));
    };


    return (
        <Container fluid>

            <div>
                <div className="mb-4">
                    <HeadCard>
                        <div className='Header-div'>
                            <h3>{t("EDIT_EVENT")}</h3>
                            <div className='event-button'>
                                <Button type="Submit"  loading={loading} onClick={handleSubmit} style={{ backgroundColor: " #56D436", color: "#fff", padding: "10px 18px", width: "238px" }} name={t("SAVE")} />
                            </div>
                        </div>
                    </HeadCard>
                </div>

                <Form className='create-event' onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={6} md={12} className='mb-4'>
                            <Card>
                                <div className='booking-main-head'>
                                    <h3 className='mb-4'>{t('EVENT_DETAILS')}</h3>

                                    <Form.Group controlId="eventId" className="mb-3">
                                        <CustomInput
                                            type="dropdown"
                                            label={t("EVENT_CATEGORY")}
                                            options={categories}
                                            value={formValues.eventId}
                                            onChange={handleChange}
                                            name="eventId"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventId}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventName" className="mb-3">
                                        <CustomInput
                                            type="text"
                                            label={t("EVENT_NAME")}
                                            value={formValues.eventName}
                                            onChange={handleChange}
                                            name="eventName"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventName}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventDescription" className="mb-3">
                                        <CustomTextArea
                                            label={t("EVENT_DESCRIPTION")}
                                            value={formValues.eventDescription}
                                            onChange={handleChange}
                                            name="eventDescription"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventDescription}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventDate" className="mb-3">
                                        <CustomInput
                                            type="date"
                                            label={t("EVENT_DATE")}
                                            value={formValues.eventDate}
                                            onChange={handleChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            name="eventDate"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventDate}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventTime" className="mb-3">
                                        
                                    <CustomInput
                                            type="time"
                                            step={1}
                                            label={t("EVENT_TIME")}
                                            value={formValues.eventTime}
                                            onChange={handleChange}
                                            name="eventTime"
                                             format="HH:mm"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventTime}</p>
                                    </Form.Group>

                                    <Form.Group controlId="price" className="mb-3">
                                        <CustomInput
                                            type="text"
                                            label={`${t("EVENT_PRICE")} $`}
                                            value={formValues.price}
                                            onChange={handleChange}
                                            name="price"
                                        />
                                        <p style={{ color: 'red' }}>{error.price}</p>
                                    </Form.Group>

                                    <Form.Group controlId="location" className="mb-3">
                                        <Form.Label className='form-event'>{t("LOCATION")} <span className='span-star'>*</span></Form.Label>
                                        <CustomInput
                                            type="text"
                                            className='form-event-control form-control'
                                            name="location"
                                            value={inputValue}
                                            onChange={handleLocationChange}
                                        />
                                        {locationSuggestions.length > 0 && (
                                            <ul className="suggestions-list">
                                                {locationSuggestions.map((place) => (
                                                    <div className='dropdown-location' key={place.place_id}>
                                                        <li onClick={() => handleLocationSelect(place)}>
                                                            {place.display_name}
                                                        </li>
                                                    </div>
                                                ))}
                                            </ul>
                                        )}
                                        <p style={{ color: 'red' }}>{error.location}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventType" className="mb-3">
                                        <CustomInput
                                            type="text"
                                            label={t("EVENT_TYPE")}
                                            value={formValues.eventType}
                                            onChange={handleChange}
                                            name="eventType"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventType}</p>
                                    </Form.Group>

                                    <Form.Group controlId="totalSeats" className="mb-3">
                                        <CustomInput
                                            type="text"
                                            label={t("TOTAL_TYPES")}
                                            value={formValues.totalSeats}
                                            onChange={handleChange}
                                            name="totalSeats"
                                        />
                                        <p style={{ color: 'red' }}>{error.totalSeats}</p>
                                    </Form.Group>

                                    <Form.Group controlId="eventGuidelines" className="mb-3">
                                        <CustomTextArea
                                            label={t("EVENT_GUIDELINES")}
                                            value={formValues.eventGuideline}
                                            onChange={handleChange}
                                            name="eventGuideline"
                                        />
                                        <p style={{ color: 'red' }}>{error.eventGuideline}</p>
                                    </Form.Group>

                                    <Form.Group controlId="image" className="mb-3">
                                        <CustomInput
                                            type="file"
                                            label={t("EVENT_IMAGE")}
                                            onChange={handleChange}
                                            name="imageUrl"
                                        />
                                        {formValues.imageUrlPreview ? (
                                            <img
                                                src={formValues.imageUrlPreview}
                                                alt="Preview"
                                                style={{ width: '40%', height: 'auto', marginTop: "10px" }}
                                            />
                                        ) : formValues.imageUrl ? (
                                            <img
                                                src={`${formValues.imageUrl}`}
                                                alt="Event"
                                                style={{ width: '40%', height: 'auto', marginTop: "10px" }}
                                            />
                                        ) : (
                                            <div>{t("NO_IMAGE_AVAILABLE")}</div>
                                        )}
                                        <p style={{ color: 'red' }}>{error.imageUrl}</p>
                                    </Form.Group>
                                </div>
                            </Card>
                        </Col>

                        <Col lg={6} md={12}>
                            <Card>
                                <div>
                                    <div className='d-flex justify-content-between mb-2'>
                                        <h3 className='mb-3'>{t("EVENT_SPEAKER")}</h3>

                                    </div>
                                    <Form.Group controlId="speakerName" className="mb-3">
                                        <CustomInput
                                            type="text"
                                            label={t("SPEAKER_NAME")}
                                            value={currentSpeaker.speakerName}
                                            onChange={handleSpeakerChange}
                                            name="speakerName"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="speakerType" className="mb-3">
                                        <CustomTextArea
                                            label={t("SPEAKER_TYPE")}
                                            value={currentSpeaker.speakerType}
                                            onChange={handleSpeakerChange}
                                            name="speakerType"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="speakerImage" className="mb-3">
                                        <Form.Label className="form-event">
                                            {t("SPEAKER_IMAGE")} <span className="span-star">*</span>
                                        </Form.Label>


                                        <div className="custom-file-input-wrapper">
                                            <CustomInput ref={fileInputRef} className="form-event-control custom-file-input" type="file" onChange={handleSpeakerChange} name="speakerImage" />
                                        </div>

                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Speaker Preview"
                                                    style={{
                                                        maxWidth: '200px',
                                                        maxHeight: '200px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>

                                    <div className="mt-4">
                                        <h3 className='mb-4'>{t("SPEAKER")}:</h3>
                                        <div>
                                            {speakers.length > 0 ? (
                                                <CustomTable headers={headers} data={speakers} onRemove={removeSpeaker} onEdit={handleEditSpeaker} />

                                            ) : (
                                                <p className='noSpeaker-yet'>{t("NO_SPEAKER_ADDED_YET")}</p>
                                            )}
                                        </div>
                                    </div>
                                  
                                    <div className='speaker-button'>  {speakerActionButton}</div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Container>
    );
};

export default CreateEvent;
