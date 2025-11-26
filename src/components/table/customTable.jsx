/**
 * BootstrapCustomTable Component
 *
 * A customizable Bootstrap-styled table component with pagination, loading states, and role-based action buttons.
 *
 * @component
 * @param {Object} props - React props.
 * @param {string[]} props.headers - The column headers for the table.
 * @param {Object[]} props.data - The table data, where each object represents a row.
 * @param {number} props.rowsPerPage - The number of rows displayed per page.
 * @param {function} props.onEdit - Function called when the edit button is clicked.
 * @param {function} props.onDelete - Function called when the delete button is clicked.
 * @param {function} props.onModule - Function called when the "Open Module" button is clicked.
 * @param {string} props.featureName - The feature name used for permission checking.
 * @param {boolean} props.loading - Whether the table is in a loading state.
 * @param {number} props.currentPage - The current page number.
 * @param {number} props.totalPages - The total number of pages.
 * @param {number} props.totalItems - The total number of items in the dataset.
 * @param {function} props.onPageChange - Function called when the page is changed.
 * @param {function} props.onRowsPerPageChange - Function called when the number of rows per page is changed.
 * @returns {JSX.Element} The rendered BootstrapCustomTable component.
 *
 * @example
 * <BootstrapCustomTable
 *   headers={["Name", "Status", "Actions"]}
 *   data={[
 *     { Name: "John Doe", Status: "Active" },
 *     { Name: "Jane Doe", Status: "Inactive" }
 *   ]}
 *   rowsPerPage={10}
 *   onEdit={(row) => console.log("Edit", row)}
 *   onDelete={(row) => console.log("Delete", row)}
 *   onModule={(row) => console.log("Open Module", row)}
 *   featureName="UserManagement"
 *   loading={false}
 *   currentPage={1}
 *   totalPages={5}
 *   totalItems={50}
 *   onPageChange={(page) => console.log("Page Change", page)}
 *   onRowsPerPageChange={(rows) => console.log("Rows per Page Change", rows)}
 * />
 */

import 'react-loading-skeleton/dist/skeleton.css';

import React from 'react';
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
  rowsPerPage,
  onEdit,
  onDelete,
  onModule,
  featureName,
  loading,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onRowsPerPageChange
}) => {
  const canEdit = hasPermission(featureName, constant.CREATE_ROLE);
  const canDelete = hasPermission(featureName, constant.CREATE_ROLE);

  
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
      onPageChange(newPage);
    }
  };


  const renderStatus = (status) => {
    const statusClass = getStatusColor(status);
    return (
        <span className={`font-weight-bold ${statusClass}`}>
            {status}
        </span>
    );
};

  const { t } = useTranslation();
  const firstRowIndex = (currentPage - 1) * rowsPerPage + 1;
  const lastRowIndex = Math.min(currentPage * rowsPerPage, totalItems);

  

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
            ) : data.length === 0 ? (
              <tr>
                  <td colSpan={headers.length} className="text-center  py-4">
                      {t("NO_DATA_AVAILABLE")}
                  </td>
              </tr>
          )  : (
              data.map((row, index) => (
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
              onChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>
          <span>{`${firstRowIndex} - ${lastRowIndex} of ${totalItems}`}</span>
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