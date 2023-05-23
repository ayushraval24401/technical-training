import React, { useState, useEffect } from "react";
import "../assets/css/home.css";
import { customStyles } from "../utils/customStyles";
import DataTable from "react-data-table-component";
import { getApi } from "../utils/apis";
import AddTemplateModal from "../components/AddTemplateModal";
import EditTemplateModal from "../components/EditTemplateModal";
import DeleteTemplateModal from "../components/DeleteTemplateModal";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";

export default function Home() {
  const [templateData, setTemplateData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, isError] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState({});

  const [reportsData, setReportsData] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  const [search, setSearch] = useState("");

  const [isDbLoading, setIsDbLoading] = useState(false);

  const getReports = () => {
    getApi("reports")
      .then((res) => {
        setReportsData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCompanies = () => {
    getApi("companies")
      .then((res) => {
        setCompanyData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTemplate = (id: any) => {
    getApi(`templates/${id}`)
      .then((res) => {
        setSelectedTemplate(res?.data?.data);
      })
      .catch((err) => {
        console.log("ERROR: ", err);
      });
  };

  const handleSearch = (e: string) => {
    setSearch(e);
  };

  const columns = [
    {
      name: "Template Name",
      selector: (row: any) => row?.name,
      style: {
        justifyContent: "center",
        alignItems: "center",
      },
    },
    {
      name: "Last Modified",
      selector: (row: any) => (
        <>
          <p>
            {new Date(row?.updated_at).toLocaleString("en-us", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
          <p>{row?.modified_by}</p>
        </>
      ),
      style: {
        justifyContent: "center",
        alignItems: "center",
      },
    },
    {
      name: "Report Type",
      selector: (row: any) => row?.report?.name,
      style: {
        justifyContent: "center",
        alignItems: "center",
      },
    },
    {
      name: "Companies Selected",
      selector: (row: any) => (
        <ul className=" -menu">
          {row?.companies?.map((item: any) => (
            <li>{item?.name}</li>
          ))}
        </ul>
      ),
      style: {
        justifyContent: "center",
        alignItems: "center",
      },
    },
    {
      name: "Actions",
      selector: (row: any) => (
        <div className="product_actions">
          <button
            className="action_view mx-1 pointer_hover btn btn-primary"
            onClick={() => {
              getTemplate(row?.id);
              setShowEditModal(true);
            }}
          >
            Edit
          </button>

          <button
            className="action_delete mx-1 pointer_hover btn btn-danger"
            onClick={() => {
              setShowDeleteModal(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
      style: {
        justifyContent: "center",
        alignItems: "center",
      },
    },
  ];

  const getTemplates = () => {
    const queryData = {
      page: page,
      limit: perPage,
      column: "name",
      search: search.trim(),
    };

    setIsLoading(true);
    getApi("templates", queryData)
      .then((res) => {
        console.log("RES: ", res);
        setIsLoading(false);
        setTotalRows(res?.data?.total);
        setTemplateData(res?.data?.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getReports();
    getCompanies();
  }, []);

  useEffect(() => {
    getTemplates();
  }, [perPage, page, search]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePerRowsChange = (p: any) => {
    setPerPage(p);
  };

  const handleBackup = () => {
    setIsDbLoading(true);

    const url: any = process.env.REACT_APP_AZURE_FUNCTION_URI;

    axios
      .get(url)
      .then((res) => {
        setIsDbLoading(false);
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        setIsDbLoading(false);
        toast.error(err.message);
      });
  };

  return (
    <div className="container">
      <div className="dashboard">
        <div className="row mb-5 justify-content-end">
          <button
            onClick={handleBackup}
            className="btn btn-primary col-md-2 mx-2"
          >
            {isDbLoading ? (
              <RotatingLines
                strokeColor="#fff"
                strokeWidth="4"
                animationDuration="0.75"
                width="28"
                visible={true}
              />
            ) : (
              "Backup DB"
            )}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-success col-md-2 mx-2"
          >
            Create Template
          </button>
          <div className="col-md-3">
            <input
              className="form-control mx-2"
              id="exampleDataList"
              placeholder="Type to search..."
              style={{ borderRadius: "0px" }}
              onChange={(e: any) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={templateData}
          responsive={true}
          striped={true}
          progressPending={isLoading}
          customStyles={customStyles}
          pagination={true}
          paginationServer={true}
          onChangePage={handlePageChange}
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handlePerRowsChange}
          paginationRowsPerPageOptions={[10, 15, 20, 25]}
        />
      </div>
      {showAddModal && (
        <AddTemplateModal
          isOpen={showAddModal}
          setIsOpen={setShowAddModal}
          reportsData={reportsData}
          companyData={companyData}
          getTemplates={getTemplates}
        />
      )}
      {showEditModal && (
        <EditTemplateModal
          isOpen={showEditModal}
          setIsOpen={setShowEditModal}
          data={selectedTemplate}
          reportsData={reportsData}
          companyData={companyData}
          getTemplates={getTemplates}
        />
      )}
      {showDeleteModal && (
        <DeleteTemplateModal
          isOpen={showDeleteModal}
          setIsOpen={setShowDeleteModal}
          data={templateData}
          getTemplates={getTemplates}
        />
      )}
    </div>
  );
}
