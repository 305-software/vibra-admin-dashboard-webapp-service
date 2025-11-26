import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { IoCloseOutline, IoCreateOutline } from "react-icons/io5";

import Button from '../button/button';
import CustomModal from '../modal/Modal';
/**
 * CustomTable component renders a table with speaker details including name, type, and image.
 * It also provides options to edit and remove a speaker.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.headers - Array of table header names
 * @param {Array} props.data - Array of speaker objects to display
 * @param {Function} props.onRemove - Function to handle speaker removal
 * @param {Function} props.onEdit - Function to handle speaker editing
 * @returns {JSX.Element} A table displaying speaker details
 */
const CustomTable = ({ headers, data, onRemove, onEdit }) => {
  const speakersArray = Array.isArray(data) ? data : data ? [data] : [];
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleRemoveClick = (index) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIndex(null);
  };

  const handleDelete = () => {
    if (selectedIndex !== null) {
      onRemove(selectedIndex);
      handleCloseModal();
    }
  };

  if (speakersArray.length === 0) {
    return <div>{t("NO_DATA_AVAILABLE")}</div>;
  }

  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {speakersArray.map((speaker, index) => (
            <tr key={speaker._id || index}>
              <td>{speaker.speakerName}</td>
              <td>{speaker.speakerType}</td>
              <td>
                {speaker.speakerImage ? (
                  <img
                    src={typeof speaker.speakerImage === 'string' ? `${speaker.speakerImage}` : URL.createObjectURL(speaker.speakerImage)}
                    alt={`${speaker.speakerName} Image`}
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                ) : (
                  "no image"
                )}
              </td>
              <td>
                <div>
                  <IoCreateOutline
                    size={20}
                    onClick={() => onEdit(speaker, index)}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                  />
                  <IoCloseOutline
                    size={20}
                    onClick={() => handleRemoveClick(index)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CustomModal
        show={showModal}
        handleClose={handleCloseModal}
        handleConfirm={handleDelete}
        body={
          <div>
            <h3 className='mb-3'>{t("DELETE")}</h3>
            <h5>{t("ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_SPEAKER")}</h5>
            <div className='d-flex justify-content-end gap-2 mt-3'>


              <Button
                name={t("CANCEL")}
                style={{ backgroundColor: "#6c757d", color: "white" }}
                onClick={handleCloseModal}
              
              />
              <Button
                type="submit"
                style={{ backgroundColor: "rgb(231, 28, 28)", color: "white" }}
                name={t("DELETE")}
                onClick={handleDelete}
              
              />

           
            </div>
          </div>
        }
      />
    </div>
  );
};

export default CustomTable;
