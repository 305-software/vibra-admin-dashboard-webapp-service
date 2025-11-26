/**
 * CreateEvent Component
 *
 * This component is responsible for creating a new event, including details about the event itself
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
 * - useNavigate: React Router hook for navigation.
 * - toast, ToastContainer: Components for displaying toast notifications.
 * - createEventDetails, eventCategoryDetails: Redux actions for event management.
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
 * - eventImagePreview: URL for the preview of the event's image.
 * - loading: Boolean indicating whether the form submission is in progress.
 *
 * @methods
 * - handleChange: Updates form values based on user input.
 * - handleSpeakerChange: Updates the current speaker's details.
 * - handleEditSpeaker: Prepares the form for editing an existing speaker.
 * - addSpeaker: Adds a new speaker to the list.
 * - handleSubmit: Validates and submits the form data to create an event.
 * - validate: Checks for required fields and sets error messages.
 * - removeSpeaker: Removes a speaker from the list.
 * - handleLocationChange: Fetches location suggestions based on user input.
 * - handleLocationSelect: Updates form values with the selected location.
 * - updateSpeaker: Updates an existing speaker's details or adds a new one.
 * - removeEventImage: Removes the event image and preview.
 * - removeSpeakerImage: Removes the speaker image and preview.
 *
 * @returns {JSX.Element} The rendered CreateEvent component.
 */




import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import config from "../../config"
import { createEventDetails, eventCategoryDetails } from "../../redux/eventSlice";
import * as constant from "../../utlis/constant";
import Button from '../button/button';
import HeadCard from "../card/HeaderCard"
import Card from '../card/tableCard';
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
        speakerImage: null,
    };
    const [formValues, setFormValues] = useState(initialFormValues);
    const [speakers, setSpeakers] = useState([]);
    const [currentSpeaker, setCurrentSpeaker] = useState(initialSpeakerValues);
    const [error, setError] = useState({});
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.eventSlice.eventCategory) || [];
    const fileInputRef = useRef(null);
    const eventImageInputRef = useRef(null);
    const [editingSpeakerIndex, setEditingSpeakerIndex] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [eventImagePreview, setEventImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        let processedValue = value;
        
        // Apply time formatting only for eventTime field
        if (name === 'eventTime' && value) {
          processedValue = value.substring(0, 5); // Remove seconds
        }

        // Handle event image upload
        if (name === 'imageUrl' && type === 'file' && files.length > 0) {
            const file = files[0];
            
            // Validate file type - only allow images
            if (!file.type.startsWith('image/')) {
                toast.error(t("PLEASE_SELECT_AN_IMAGE_FILE"), {
                    display: 'flex',
                    toastId: 'file-type-error',
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    toastClassName: 'custom-toast',
                    bodyClassName: 'custom-toast',
                });
                // Reset the file input
                if (eventImageInputRef.current) {
                    eventImageInputRef.current.value = '';
                }
                return;
            }
            
            setFormValues({
                ...formValues,
                [name]: file
            });
            // Create image preview for event image
            setEventImagePreview(URL.createObjectURL(file));
        } else {
            setFormValues({
                ...formValues,
                [name]: type === 'file' ? files[0] : processedValue
            });
        }
    };
    
    const handleSpeakerChange = (e) => {
        const { name, value, files } = e.target;
        if (name === constant.SPEAKERIMAGE) {
            if (files.length > 0) {
                const file = files[0];
                
                // Validate file type - only allow images
                if (!file.type.startsWith('image/')) {
                    toast.error(t("PLEASE_SELECT_AN_IMAGE_FILE"), {
                        display: 'flex',
                        toastId: 'file-type-error',
                        autoClose: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                        toastClassName: 'custom-toast',
                        bodyClassName: 'custom-toast',
                    });
                    // Reset the file input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    return;
                }
                
                setCurrentSpeaker((prev) => ({ ...prev, speakerImage: file }));

                // Create image preview
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            setCurrentSpeaker({ ...currentSpeaker, [name]: value });
        }
    };

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


    const addSpeaker = () => {
        if (currentSpeaker.speakerName && currentSpeaker.speakerType && currentSpeaker.speakerImage) {
            setSpeakers(prevSpeakers => [...prevSpeakers, currentSpeaker]);
            setCurrentSpeaker(initialSpeakerValues);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // This clears the file input
            }
            setImagePreview(null);
        } else {
            alert(t("PLEASE_FILL_ALL_THE_SPEAKER_FIELD"));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            const formData = new FormData();
            Object.keys(formValues).forEach(key => {
                formData.append(key, formValues[key]);
            });
            speakers.forEach((speaker, index) => {
                formData.append(`speakers[${index}][speakerName]`, speaker.speakerName);
                formData.append(`speakers[${index}][speakerType]`, speaker.speakerType);
                formData.append(`speakers[${index}][speakerImage]`, speaker.speakerImage);
            });
            try {
                const response = await dispatch(createEventDetails(formData)).unwrap();
             
                if (response && response.status === 200) {
                    toast.success(t("EVENT_CREATED_SUCCESSFULLY"), {
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
                    toastId: 'error-action',
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

    useEffect(() => {
        dispatch(eventCategoryDetails());
    }, [dispatch]);


    const updateSpeaker = () => {
        if (currentSpeaker.speakerName && currentSpeaker.speakerType && currentSpeaker.speakerImage) {
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

    // Function to remove event image
    const removeEventImage = () => {
        setFormValues({
            ...formValues,
            imageUrl: null
        });
        setEventImagePreview(null);
        
        // Reset file input
        if (eventImageInputRef.current) {
            eventImageInputRef.current.value = '';
        }
    };

    // Function to remove speaker image
    const removeSpeakerImage = () => {
        setCurrentSpeaker({
            ...currentSpeaker,
            speakerImage: null
        });
        setImagePreview(null);
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Modify the speaker action button
    const speakerActionButton = editingSpeakerIndex !== null
        ? <Button type="button" name={t("UPDATE_SPEAKER")} onClick={updateSpeaker} />
        : <Button type="button" name={t("ADD_MORE_SPEAKER")} onClick={addSpeaker} />;


    const validate = () => {
        const error = {};
        let isFormValid = true;

        if (!formValues.eventId || formValues.eventId.trim() === "") {
            isFormValid = false;
            error.eventId = t("PLEASE_ENTER_THE_EVENT_CATEGORY");
        }
        if (!formValues.eventName || formValues.eventName.trim() === "") {
            isFormValid = false;
            error.eventName = t("PLEASE_ENTER_THE_EVENT_NAME");
        }
        if (!formValues.eventDescription || formValues.eventDescription.trim() === "") {
            isFormValid = false;
            error.eventDescription = t("PLEASE_ENTER_THE_EVENT_SUBSCRIPTION");
        }
        if (!formValues.location || formValues.location.trim() === "") {
            isFormValid = false;
            error.location = t("PLEASE_ENTER_THE_CONSTANT");
        }
        if (!formValues.eventDate || formValues.eventDate.trim() === "") {
            isFormValid = false;
            error.eventDate = t("PLEASE_ENTER_THE_EVENTDATE");
        }
        if (!formValues.eventTime || formValues.eventTime.trim() === "") {
            isFormValid = false;
            error.eventTime = t("PLEASE_ENTER_THE_EVENTTIME");
        }
        if (!formValues.price || formValues.price.trim() === "") {
            isFormValid = false;
            error.price = t("PLEASE_ENTER_THE_EVENTPRICE");
        }
        if (!formValues.eventType || formValues.eventType.trim() === "") {
            isFormValid = false;
            error.eventType = t("PLEASE_ENTER_THE_EVENTTYPE");
        }
        if (!formValues.totalSeats || formValues.totalSeats.trim() === "") {
            isFormValid = false;
            error.totalSeats = t("PLEASE_ENTER_THE_TOTALSEATS");
        }
        if (!formValues.eventGuideline || formValues.eventGuideline.trim() === "") {
            isFormValid = false;
            error.eventGuideline = t("PLEASE_ENTER_THE_EVENT_GUIDELINES");
        }
        if (!formValues.imageUrl) {
            isFormValid = false;
            error.imageUrl = t("PLEASE_CHOOSE_THE_IMAGE");
        }

        setError(error);
        return isFormValid;
    };

    const removeSpeaker = (index) => {
        setSpeakers((prevSpeakers) => prevSpeakers.filter((_, i) => i !== index));
    };



    const handleLocationChange = async (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.trim()) {
            try {
                const response = await fetch(
                    `https://api.locationiq.com/v1/autocomplete?key=${[process.env.REACT_APP_GOOGLE_API_KEY]}=${encodeURIComponent(value)}&format=json`
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
        setInputValue(place.display_name);
        setLocationSuggestions([]);
    };

    return (
        <Container fluid>

            <div>
                <div className="mb-4">
                    <HeadCard>
                        <div className='Header-div'>
                            <h3>{t("CREATE_EVENT")}</h3>

                            <div className='event-button'>
                                <Button loading={loading} onClick={handleSubmit} style={{ backgroundColor: " #56D436", color: "#fff", padding: "10px 18px", width: "238px" }} name={t("SAVE")} />
                            </div>
                        </div>

                    </HeadCard>
                </div>

                <Form className='create-event' onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={6} md={12} className='mb-4'>
                            <Card>
                                <div className='booking-main-head'>
                                    <h3 className='mb-4'>{t("EVENT_DETAILS")}</h3>

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
                                            type="textarea"
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
                                            name="eventDate"
                                            min={new Date().toISOString().split('T')[0]


                                            }

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
                                                    <div className='dropdown-location'>
                                                        <li key={place.place_id} onClick={() => handleLocationSelect(place)}>
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
                                            ref={eventImageInputRef}
                                            type="file"
                                            label={t("EVENT_IMAGE")}
                                            onChange={handleChange}
                                            name="imageUrl"
                                            accept="image/*"
                                        />
                                        <p style={{ color: 'red' }}>{error.imageUrl}</p>
                                        
                                        {/* Event Image Preview with Delete Button */}
                                        {eventImagePreview && (
                                            <div className="mt-2 image-preview-container" style={{ position: 'relative', display: 'inline-block' }}>
                                                <img
                                                    src={eventImagePreview}
                                                    alt="Event Preview"
                                                    style={{
                                                        maxWidth: '200px',
                                                        maxHeight: '200px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        border: '1px solid #ddd'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeEventImage}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '5px',
                                                        right: '5px',
                                                        background: 'rgba(255, 0, 0, 0.7)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '50%',
                                                        width: '24px',
                                                        height: '24px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold'
                                                    }}
                                                    title="Remove Image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </Form.Group>
                                </div>
                            </Card>
                        </Col>

                        <Col lg={6} md={12}>
                            <Card >
                                <div className='booking-main-head card-height'>
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
                                                {t("SPEAKER_IMAGE")}
                                            </Form.Label>
                                            <div className="custom-file-input-wrapper">

                                                <CustomInput
                                                    ref={fileInputRef}
                                                    type="file"
                                                    onChange={handleSpeakerChange}
                                                    name="speakerImage"
                                                    className="form-event-control custom-file-input"
                                                    accept="image/*"
                                                />
                                            </div>

                                            {/* Speaker Image Preview with Delete Button */}
                                            {imagePreview && (
                                                <div className="mt-2 image-preview-container" style={{ position: 'relative', display: 'inline-block' }}>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Speaker Preview"
                                                        style={{
                                                            maxWidth: '200px',
                                                            maxHeight: '200px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            border: '1px solid #ddd'
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={removeSpeakerImage}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '5px',
                                                            right: '5px',
                                                            background: 'rgba(255, 0, 0, 0.7)',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '24px',
                                                            height: '24px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '14px',
                                                            fontWeight: 'bold'
                                                        }}
                                                        title="Remove Image"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )}
                                        </Form.Group>

                                        <div className="mt-4 speaker-details">
                                            <div>
                                                {speakers.length > 0 ? (
                                                    <CustomTable headers={headers} data={speakers} onRemove={removeSpeaker} onEdit={handleEditSpeaker} />
                                                ) : (
                                                    <p className='noSpeaker-yet'>{t("NO_SPEAKER_ADDED_YET")}</p>
                                                )}
                                            </div>
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