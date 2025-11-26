/**
 * BootstrapCustomTable Component
 * 
 * A customizable table component that displays data with pagination, loading states,
 * and action buttons for editing and deleting rows. It utilizes React Bootstrap for
 * styling and layout.
 * 
 * @component
 * @example
 * const headers = ["Name", "Email", "Status", "Actions"];
 * const data = [{ name: "John Doe", email: "john@example.com", status: "paid" }];
 * return (
 *   <BootstrapCustomTable 
 *     headers={headers} 
 *     data={data} 
 *     rowsPerPage={5} 
 *     onEdit={handleEdit} 
 *     onDelete={handleDelete} 
 *     onModule={handleModule} 
 *     featureName="User Management" 
 *     loading={false} 
 *   />
 * );
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.headers - An array of strings representing the column headers.
 * @param {Array} props.data - An array of objects representing the table data.
 * @param {number} props.rowsPerPage - The number of rows to display per page.
 * @param {function} props.onEdit - Callback function for editing a row.
 * @param {function} props.onDelete - Callback function for deleting a row.
 * @param {function} props.onModule - Callback function for opening a module.
 * @param {string} props.featureName - The feature name for permission checks.
 * @param {boolean} props.loading - A flag indicating if the table is in a loading state.
 * 
 * @returns {JSX.Element} The rendered BootstrapCustomTable component.
 * 
 * @methods
 * - hasPermission: Checks if the user has the specified permission for a feature.
 * - getStatusColor: Returns the CSS class name based on the status.
 * - renderStatus: Renders the status with appropriate styling.
 * - handleChangePage: Updates the current page based on user interaction.
 * 
 * @state
 * - currentPage: The current page number for pagination.
 * - rowsPerPage: The number of rows displayed per page.
 * 
 * @pagination
 * - Displays the total number of rows and allows users to select the number of rows per page.
 * - Provides navigation buttons for changing pages.
 */



import 'react-loading-skeleton/dist/skeleton.css';

import React,{useEffect,useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useTranslation } from "react-i18next";
import { IoTrashOutline } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import Skeleton from 'react-loading-skeleton';
import Cookies from "universal-cookie";

import * as constant from "../../utlis/constant";
import Button from '../button/button';

const hasPermission = (featureName, permissionName) => {
  const cookies = new Cookies();
  const roles = cookies.get(constant.ROLES);
  if (!roles || roles.length === 0) return false;
  const rolePermissions = roles[0]?.rolePermissions;
  const featurePermissions = rolePermissions?.find(
    (role) => role.featureName === featureName
  );

  return featurePermissions?.permissions.some(
    (perm) => perm.permissionName === permissionName
  );
};

const BootstrapCustomTable = ({
  headers,
  data,
  onEdit,
  onDelete,
  onModule,
  featureName,
  loading,
  rowsPerPage: defaultRowsPerPage,
  totalPages,
}) => {
  const canEdit = hasPermission(featureName, constant.CREATE_ROLE);
  const canDelete = hasPermission(featureName, constant.CREATE_ROLE);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  
  const getStatusColor = (status) => {
    const normalizedStatus = (status || '').toLowerCase().trim();
    switch (normalizedStatus) {
      case constant.PAID_SMALL:
        return 'paid-className';
      case constant.CANCELLED_SMALL:
        return 'refund-class';
      case constant.UNPAID:
        return 'unpaid-class';
      case constant.REFUND:
        return 'refund-class';
      default:
        return '';
    }
  };

  const handleChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  const renderStatus = (status) => {
    const statusClass = getStatusColor(status);
    return (
        <span className={`font-weight-bold ${statusClass}`}>
            {status}
        </span>
    );
};

  const { t } = useTranslation();
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);
  const firstRowIndex = (currentPage - 1) * rowsPerPage + 1;
  const lastRowIndex = Math.min(currentPage * rowsPerPage, data.length);

  

  return (
    <div>
      <div className="table-responsive">
        <Table className="table table-striped table-hover">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((_, headerIndex) => (
                    <td key={headerIndex}>
                      <Skeleton height={30} />
                    </td>
                  ))}
                </tr>
              ))
            ) : currentData.length === 0 ? (
              <tr>
                  <td colSpan={headers.length} className="text-center  py-4">
                      {t("NO_DATA_AVAILABLE")}
                  </td>
              </tr>
          )  : (
            currentData.map((row, index) => (
                <tr key={index}>
                  {headers.map((header, headerIndex) => (
                    <td key={headerIndex}>
                      {header === t("ACTIONS") ? (
                        
                        <div className="d-flex justify-content-center gap-4">
                          
                          {canEdit && (
                            <TbEdit 
                              size={20} 
                              onClick={() => onEdit(row)}
                              style={{ cursor: 'pointer' }}
                            />
                          )}
                          {canDelete && (
                            <IoTrashOutline 
                              size={20} 
                              onClick={() => onDelete(row)}
                              style={{ cursor: 'pointer' }}
                            />
                          )}
                        </div>
                      ) : header === t("STATUS") ? (
                        renderStatus(row[header])
                      ): header === t("ACTIONS")? (
                        renderStatus(row[header])
                      ) : header === 'Module' && row[header] ? (
                        <Button type="button" name="Open Module" onClick={() => onModule(row)} />
                      ) : (
                        row[header]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
      <div>
        <nav className="d-flex justify-content-end align-items-center gap-4">
          <p className="mr-2">{t("ROW_PER_PAGE")}:</p>
          <div className="d-flex align-items-center">
            <select
              className="form-control form-control-sm"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
          <span>{`${firstRowIndex} - ${lastRowIndex} of ${data.length}`}</span>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <Button
                type="button"
                name={<MdKeyboardArrowLeft />}
                className="page-link"
                style={{ marginRight: "10px" }}
                onClick={() => handleChangePage(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <Button
                type="button"
                name={<MdOutlineKeyboardArrowRight />}
                className="page-link"
                onClick={() => handleChangePage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default BootstrapCustomTable;