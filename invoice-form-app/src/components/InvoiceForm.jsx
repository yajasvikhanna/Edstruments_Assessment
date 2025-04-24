import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// import { pdfjs } from 'react-pdf';
// import { pdfjs } from 'react-pdf';
// const pdfWorker = require('pdfjs-dist/build/pdf.worker.entry');

// pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 15px;
  font-size: 18px;
  color: #666;
  display: flex;
  align-items: center;
`;

const LogoutButton = styled.button`
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 6px 15px;
  font-size: 14px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #e6e6e6;
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 18px;
  margin: 0;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  background-color: #f9f9f9;
  z-index: 10;
`;

const Tab = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  color: ${(props) => (props.$active ? "#1890ff" : "#777")};
  border-bottom: ${(props) => (props.$active ? "2px solid #1890ff" : "none")};
  margin-bottom: -2px;
  font-weight: 600;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  margin-right: 10px;
`;

const RightColumn = styled.div`
  margin-left: 10px;
`;

const FormSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const UploadSection = styled(FormSection)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  border: 2px dashed #d9d9d9;
  background-color: white;
  border-radius: 8px;
  box-shadow: none;
  text-align: center;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionIcon = styled.div`
  background-color: ${(props) => props.background || "#e6f7ff"};
  color: ${(props) => props.color || "#1890ff"};
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  font-size: 14px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  margin: 0;
  color: #333;
  id: ${(props) => props.id || ""};
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormColumn = styled.div`
  flex: 1;
`;

const RequiredLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 500;
  color: #333;

  &::after {
    content: " *";
    color: #ff4d4f;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const Select = styled(Field)`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 12px top 50%;
  background-size: 10px auto;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const CurrencyInput = styled.div`
  position: relative;

  input {
    width: 100%;
    padding: 8px 12px 8px 30px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s;
  }

  &::before {
    content: "$";
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }

  input:focus {
    outline: none;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;

  input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s;
  }

  input:focus {
    outline: none;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const TextArea = styled(Field)`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const UploadIcon = styled.div`
  background-color: #4285f4;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
`;

const UploadButton = styled.button`
  margin-top: 20px;
  background-color: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    border-color: #40a9ff;
    color: #40a9ff;
  }
`;

const PDFContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 500px;
  overflow: auto;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;

  .react-pdf__Document {
    width: 100%;
  }

  .react-pdf__Page {
    margin: 0 auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .react-pdf__Page__canvas {
    margin: 0 auto;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const Button = styled.button`
  background-color: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 6px 15px;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  &:hover {
    border-color: #40a9ff;
    color: #40a9ff;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;

  &:hover {
    background-color: #40a9ff;
    border-color: #40a9ff;
    color: white;
  }
`;

const ErrorText = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 5px;
`;

const ExpenseDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 8px 0;
`;

const TotalAmount = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 16px;
  padding: 2px;
  height: 24px;
  width: 48px;
  margin-left: 10px;
`;

const ToggleOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 20px;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.$active ? "#1890ff" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#777")};
  transition: all 0.3s;
`;

const AddExpenseButton = styled.button`
  background: none;
  border: none;
  color: #1890ff;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const FooterButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const SaveDraftButton = styled(Button)`
  background-color: white;
  color: #666;
  border-color: #d9d9d9;
`;

const SubmitButton = styled(PrimaryButton)`
  min-width: 120px;
`;

const ViewDetailsLink = styled.div`
  color: #1890ff;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  margin-top: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

const UploadText = styled.div`
  margin-bottom: 20px;
  font-weight: bold;
`;

const UploadSubText = styled.div`
  color: #666;
  margin-bottom: 10px;
`;

const UploadInstruction = styled.div`
  color: #1890ff;
  font-size: 14px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled(Input)`
  border-color: ${(props) => (props.$hasError ? "#ff4d4f" : "#d9d9d9")};
  background-color: ${(props) => (props.$hasError ? "#fff2f0" : "white")};

  &:focus {
    border-color: ${(props) => (props.$hasError ? "#ff4d4f" : "#40a9ff")};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.$hasError ? "rgba(255, 77, 79, 0.2)" : "rgba(24, 144, 255, 0.2)"};
  }
`;

const StyledSelect = styled(Select)`
  border-color: ${(props) => (props.$hasError ? "#ff4d4f" : "#d9d9d9")};
  background-color: ${(props) => (props.$hasError ? "#fff2f0" : "white")};

  &:focus {
    border-color: ${(props) => (props.$hasError ? "#ff4d4f" : "#40a9ff")};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.$hasError ? "rgba(255, 77, 79, 0.2)" : "rgba(24, 144, 255, 0.2)"};
  }
`;

// Form validation schema

const validationSchema = Yup.object({
  vendor: Yup.string()
    .required("Vendor is required")
    .notOneOf([""], "Vendor is required"),
  purchaseOrderNumber: Yup.string()
    .required("Purchase order number is required")
    .matches(/^PO-\d{4}-\d{3}$/, "PO number format should be PO-YYYY-###"),
  invoiceNumber: Yup.string()
    .required("Invoice number is required")
    .matches(
      /^INV-\d{4}-\d{3}$/,
      "Invoice number format should be INV-YYYY-###"
    ),
  invoiceDate: Yup.date()
    .required("Invoice date is required")
    .max(new Date(), "Invoice date cannot be in the future"),
  dueDate: Yup.date()
    .required("Due date is required")
    .min(Yup.ref("invoiceDate"), "Due date must be after invoice date"),
  paymentTerms: Yup.string()
    .required("Payment terms are required")
    .notOneOf([""], "Payment terms are required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .typeError("Amount must be a number"),
  lineAmount: Yup.number()
    .required("Line amount is required")
    .positive("Line amount must be positive")
    .typeError("Line amount must be a number")
    .test(
      "line-amount-matches-total",
      "Line amounts should sum to total amount",
      function (value) {
        return value === this.parent.amount;
      }
    ),
  department: Yup.string()
    .required("Department is required")
    .notOneOf([""], "Department is required"),
  account: Yup.string()
    .required("Account is required")
    .notOneOf([""], "Account is required"),
  location: Yup.string()
    .required("Location is required")
    .notOneOf([""], "Location is required"),
});

// Dummy data for form population
const DUMMY_DATA = {
  vendor: "vendor1",
  vendorAddress: "350 Main St, Lynn",
  purchaseOrderNumber: "PO-2025-001",
  invoiceNumber: "INV-2025-001",
  invoiceDate: "2025-04-15",
  dueDate: "2025-05-15",
  postDate: "2025-04-16",
  paymentTerms: "net30",
  amount: "1250.00",
  description: "Monthly service subscription for Q2 2025",
  lineAmount: "1250.00",
  department: "marketing",
  account: "account1",
  location: "location1",
  expenseDescription: "Q2 Marketing expenses",
  comments:
    "This invoice has been verified against PO-2025-001 and approved for payment.",
  _submitType: "",
};

const InvoiceForm = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("vendor");
  const [pdfFile, setPdfFile] = useState(null);
  const [isPdfValid, setIsPdfValid] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [userData, setUserData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const vendorSectionRef = useRef(null);
  const invoiceSectionRef = useRef(null);
  const commentsSectionRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const formikRef = useRef(null);

  // Load saved data on component mount
  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if it's a PDF based on file type
      if (file.type === "application/pdf") {
        // Create a URL for the file object - this is key for react-pdf to work properly
        const fileURL = URL.createObjectURL(file);
        setPdfFile(fileURL);
        setIsPdfValid(true);
      } else {
        setIsPdfValid(false);
        setErrorMessage("Please upload a valid PDF file.");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Clean up the URL object when component unmounts or when pdfFile changes
      if (
        pdfFile &&
        typeof pdfFile === "string" &&
        pdfFile.startsWith("blob:")
      ) {
        URL.revokeObjectURL(pdfFile);
      }
    };
  }, [pdfFile]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (formikRef.current) {
        const values = formikRef.current.values;
        sessionStorage.setItem(
          "invoiceDataSessionDraft",
          JSON.stringify(values)
        );
      }
    }, 1000); // Save draft every 1 second

    return () => clearInterval(interval); // Clear on unmount
  }, []);

  const handleSubmit = (values, { setSubmitting, validateForm }) => {
    validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        // All fields are valid, proceed with form submission
        localStorage.setItem("invoiceData", JSON.stringify(values));

        sessionStorage.removeItem("invoiceDataSessionDraft");

        formikRef.current?.resetForm();

        setSuccessMessage("Invoice data saved successfully!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        // Show error message that form has validation errors
        setErrorMessage("Please fill all required fields before submitting.");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
      setSubmitting(false);
    });
  };

  const handleDraftSave = () => {
    if (formikRef.current) {
      const currentValues = formikRef.current.values;
      localStorage.setItem("invoiceDataDraft", JSON.stringify(currentValues));
      showToastHandler("Draft saved successfully!");
    }
  };

  const handleSubmitAndClear = async () => {
    if (formikRef.current) {
      const errors = await formikRef.current.validateForm();

      if (Object.keys(errors).length > 0) {
        formikRef.current.setTouched(
          Object.keys(errors).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {}),
          true
        );
        showToast(
          "Please fill all required fields before submitting.",
          "error"
        );
        // ...

        return;
      }

      // Valid form
      const currentValues = formikRef.current.values;
      localStorage.setItem("invoiceData", JSON.stringify(currentValues));
      sessionStorage.removeItem("draftInvoiceData");
      formikRef.current.resetForm();

      showToastHandler("Invoice submitted successfully!");
    }
  };

  const handleLogout = () => {
    // Clear all invoice-related data from localStorage and sessionStorage
    localStorage.removeItem("userData"); // user session
    localStorage.removeItem("invoiceData"); // final submitted data
    localStorage.removeItem("invoiceDataDraft"); // draft data
    sessionStorage.removeItem("invoiceDataSessionDraft"); // session-based draft

    // Call the logout function passed from parent component
    if (onLogout) {
      onLogout();
    }
  };

  const populateDummyData = () => {
    if (formikRef.current) {
      formikRef.current.setValues({
        ...DUMMY_DATA,
        _submitType: "",
      });
    }
  };

  // Scroll to the section when tab changes
  useEffect(() => {
    if (activeTab === "vendor" && vendorSectionRef.current) {
      vendorSectionRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (activeTab === "invoice" && invoiceSectionRef.current) {
      invoiceSectionRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (activeTab === "comments" && commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab]);

  // Get saved form data from localStorage (if exists)
  const getSavedFormData = () => {
    const sessionDraft = sessionStorage.getItem("invoiceDataSessionDraft");
    const savedDraft = localStorage.getItem("invoiceDataDraft");
    const savedFinal = localStorage.getItem("invoiceData");
    const sourceData = sessionDraft || savedDraft || savedFinal;

    if (sourceData) {
      return {
        ...JSON.parse(sourceData),
        _submitType: "", // Add _submitType field for conditional validation
      };
    }

    // Default empty form data with _submitType field
    return {
      vendor: "",
      vendorAddress: "",
      purchaseOrderNumber: "",
      invoiceNumber: "",
      invoiceDate: "",
      dueDate: "",
      postDate: "",
      paymentTerms: "",
      amount: "",
      description: "",
      lineAmount: "",
      department: "",
      account: "",
      location: "",
      expenseDescription: "",
      comments: "",
      _submitType: "",
    };
  };

  // Toggle currency symbol
  const toggleCurrencySymbol = () => {
    setCurrencySymbol((prev) => (prev === "$" ? "%" : "$"));
  };

  const showToastHandler = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <Container>
      <Header>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BackButton>←</BackButton>
          <Title>Create New Invoice</Title>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={populateDummyData}>Fill with Dummy Data</Button>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </div>
      </Header>
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#323232",
            color: "#fff",
            padding: "14px 24px",
            borderRadius: "8px",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontSize: "15px",
            maxWidth: "300px",
            animation: "fadeOut 3s ease forwards",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span>{toastMessage}</span>
          <div
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.2)",
              overflow: "hidden",
              borderRadius: "2px",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#4caf50",
                animation: "progressBar 3s linear forwards",
              }}
            />
          </div>
        </div>
      )}

      {successMessage && (
        <div
          style={{
            backgroundColor: "#f6ffed",
            color: "#52c41a",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
          }}
        >
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            backgroundColor: "#fff2f0",
            color: "#ff4d4f",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "4px",
          }}
        >
          {errorMessage}
        </div>
      )}

      <ContentContainer>
        <LeftColumn>
          <UploadSection>
            <UploadText>Upload Your Invoice</UploadText>
            <UploadSubText>To auto-populate fields and save time</UploadSubText>

            {!pdfFile ? (
              <>
                <UploadIcon>
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 17L12 14M12 14L15 17M12 14V21M20 17.6073C21.1956 16.8135 22 15.4904 22 14C22 11.7909 20.2091 10 18 10C17.8131 10 17.6289 10.0119 17.4489 10.0351C16.5474 7.6992 14.3955 6 11.8 6C8.4196 6 5.66432 8.60721 5.52935 11.9383C3.98292 12.5081 3 14.0674 3 15.8571C3 18.1922 4.8478 20 7.2 20H8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </UploadIcon>

                <input
                  type="file"
                  id="pdfUpload"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  style={{ display: "none" }}
                />

                <UploadButton
                  onClick={() => document.getElementById("pdfUpload").click()}
                >
                  Upload File
                </UploadButton>

                <UploadInstruction>
                  Click to upload or drag and drop
                </UploadInstruction>
              </>
            ) : isPdfValid ? (
              <>
                <PDFContainer>
                  <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    error="An error occurred while loading the PDF."
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                </PDFContainer>

                {numPages && (
                  <ButtonGroup>
                    <Button onClick={previousPage} disabled={pageNumber <= 1}>
                      Previous
                    </Button>
                    <div>
                      Page {pageNumber || (numPages ? 1 : "--")} of{" "}
                      {numPages || "--"}
                    </div>
                    <Button
                      onClick={nextPage}
                      disabled={pageNumber >= numPages}
                    >
                      Next
                    </Button>
                  </ButtonGroup>
                )}
              </>
            ) : (
              <div>
                <p>Invalid PDF file. Please upload a valid PDF.</p>
                <Button
                  onClick={() => document.getElementById("pdfUpload").click()}
                >
                  Try Another File
                </Button>
              </div>
            )}
          </UploadSection>
        </LeftColumn>

        <RightColumn>
          <TabsContainer>
            <Tab
              $active={activeTab === "vendor"}
              onClick={() => setActiveTab("vendor")}
            >
              Vendor Details
            </Tab>
            <Tab
              $active={activeTab === "invoice"}
              onClick={() => setActiveTab("invoice")}
            >
              Invoice Details
            </Tab>
            <Tab
              $active={activeTab === "comments"}
              onClick={() => setActiveTab("comments")}
            >
              Comments
            </Tab>
          </TabsContainer>
          <Formik
            initialValues={getSavedFormData()}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            innerRef={formikRef}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                {/* Vendor Details Section */}
                <FormSection ref={vendorSectionRef} id="vendor-section">
                  <SectionHeader>
                    <SectionIcon background="#e6f7ff" color="#1890ff">
                      📊
                    </SectionIcon>
                    <SectionTitle>Vendor Details</SectionTitle>
                  </SectionHeader>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                      Vendor Information
                    </div>

                    <FormGroup>
                      <RequiredLabel htmlFor="vendor">Vendor</RequiredLabel>
                      <InputWrapper>
                        <StyledSelect
                          as="select"
                          id="vendor"
                          name="vendor"
                          $hasError={errors.vendor && touched.vendor}
                        >
                          <option value="">Select Vendor</option>
                          <option value="vendor1">A - 1 Exterminators</option>
                          <option value="vendor2">Vendor 2</option>
                        </StyledSelect>
                        <ErrorMessage name="vendor" component={ErrorText} />
                      </InputWrapper>
                    </FormGroup>

                    <FormGroup>
                      <p
                        style={{
                          fontWeight: "300",
                          fontSize: "10px",
                          color: "#888888",
                        }}
                      >
                        350 Main St, Lynn
                      </p>
                    </FormGroup>

                    <ViewDetailsLink>
                      <span style={{ color: "#1890ff" }}>
                        → View Vendor Details
                      </span>
                    </ViewDetailsLink>
                  </div>
                </FormSection>

                {/* Invoice Details Section */}
                <FormSection ref={invoiceSectionRef} id="invoice-section">
                  <SectionHeader>
                    <SectionIcon background="#f7f0ff" color="#722ed1">
                      📄
                    </SectionIcon>
                    <SectionTitle>Invoice Details</SectionTitle>
                  </SectionHeader>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                      General Information
                    </div>

                    <FormGroup>
                      <RequiredLabel htmlFor="purchaseOrderNumber">
                        Purchase Order Number
                      </RequiredLabel>
                      <Select
                        as="select"
                        id="purchaseOrderNumber"
                        name="purchaseOrderNumber"
                      >
                        <option value="">Select PO Number</option>
                        <option value="PO-2025-001">PO-2025-001</option>
                        <option value="PO-2025-002">PO-2025-002</option>
                      </Select>
                      <ErrorMessage
                        name="purchaseOrderNumber"
                        component={ErrorText}
                      />
                    </FormGroup>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                      Invoice Details
                    </div>

                    <FormRow>
                      <FormColumn>
                        <RequiredLabel htmlFor="invoiceNumber">
                          Invoice Number
                        </RequiredLabel>
                        <Select
                          as="select"
                          id="invoiceNumber"
                          name="invoiceNumber"
                        >
                          <option value="">Select Invoice</option>
                          <option value="INV-2025-001">INV-2025-001</option>
                          <option value="INV-2025-002">INV-2025-002</option>
                        </Select>
                        <ErrorMessage
                          name="invoiceNumber"
                          component={ErrorText}
                        />
                      </FormColumn>

                      <FormColumn>
                        <RequiredLabel htmlFor="invoiceDate">
                          Invoice Date
                        </RequiredLabel>
                        <DatePickerWrapper>
                          <Input
                            type="date"
                            id="invoiceDate"
                            name="invoiceDate"
                          />
                        </DatePickerWrapper>
                        <ErrorMessage
                          name="invoiceDate"
                          component={ErrorText}
                        />
                      </FormColumn>
                    </FormRow>

                    <FormRow>
                      <FormColumn>
                        <RequiredLabel htmlFor="amount">
                          Total Amount
                        </RequiredLabel>
                        <CurrencyInput>
                          <Input
                            type="number"
                            id="amount"
                            name="amount"
                            step="0.01"
                          />
                        </CurrencyInput>
                        <div
                          style={{
                            textAlign: "right",
                            fontSize: "12px",
                            color: "#999",
                          }}
                        >
                          USD
                        </div>
                        <ErrorMessage name="amount" component={ErrorText} />
                      </FormColumn>

                      <FormColumn>
                        <RequiredLabel htmlFor="paymentTerms">
                          Payment Terms
                        </RequiredLabel>
                        <Select
                          as="select"
                          id="paymentTerms"
                          name="paymentTerms"
                        >
                          <option value="">Select</option>
                          <option value="net30">Net 30</option>
                          <option value="net45">Net 45</option>
                          <option value="net60">Net 60</option>
                        </Select>
                        <ErrorMessage
                          name="paymentTerms"
                          component={ErrorText}
                        />
                      </FormColumn>
                    </FormRow>

                    <FormRow>
                      <FormColumn>
                        <RequiredLabel htmlFor="dueDate">
                          Invoice Due Date
                        </RequiredLabel>
                        <DatePickerWrapper>
                          <Input type="date" id="dueDate" name="dueDate" />
                        </DatePickerWrapper>
                        <ErrorMessage name="dueDate" component={ErrorText} />
                      </FormColumn>

                      <FormColumn>
                        <Label htmlFor="postDate">GL Post Date</Label>
                        <DatePickerWrapper>
                          <Input type="date" id="postDate" name="postDate" />
                        </DatePickerWrapper>
                      </FormColumn>
                    </FormRow>

                    <FormGroup>
                      <Label htmlFor="description">Invoice Description</Label>
                      <TextArea
                        id="description"
                        name="description"
                        component="textarea"
                        placeholder="Add a description"
                      />
                    </FormGroup>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <ExpenseDetails>
                      <div style={{ fontWeight: "bold" }}>Expense Details</div>
                      <TotalAmount>
                        $ 0.00 / $ 0.00
                        <ToggleSwitch>
                          <ToggleOption
                            $active={currencySymbol === "$"}
                            onClick={() => setCurrencySymbol("$")}
                          >
                            $
                          </ToggleOption>
                          <ToggleOption
                            $active={currencySymbol === "%"}
                            onClick={() => setCurrencySymbol("%")}
                          >
                            %
                          </ToggleOption>
                        </ToggleSwitch>
                      </TotalAmount>
                    </ExpenseDetails>

                    <FormRow>
                      <FormColumn>
                        <RequiredLabel htmlFor="lineAmount">
                          Line Amount
                        </RequiredLabel>
                        <CurrencyInput>
                          <Input
                            type="number"
                            id="lineAmount"
                            name="lineAmount"
                            step="0.01"
                          />
                        </CurrencyInput>
                        <div
                          style={{
                            textAlign: "right",
                            fontSize: "12px",
                            color: "#999",
                          }}
                        >
                          USD
                        </div>
                        <ErrorMessage name="lineAmount" component={ErrorText} />
                      </FormColumn>

                      <FormColumn>
                        <RequiredLabel htmlFor="department">
                          Department
                        </RequiredLabel>
                        <Select as="select" id="department" name="department">
                          <option value="">Select Department</option>
                          <option value="marketing">Marketing</option>
                          <option value="operations">Operations</option>
                          <option value="it">IT</option>
                        </Select>
                        <ErrorMessage name="department" component={ErrorText} />
                      </FormColumn>
                    </FormRow>

                    <FormRow>
                      <FormColumn>
                        <RequiredLabel htmlFor="account">Account</RequiredLabel>
                        <Select as="select" id="account" name="account">
                          <option value="">Select Account</option>
                          <option value="account1">Account 1</option>
                          <option value="account2">Account 2</option>
                        </Select>
                        <ErrorMessage name="account" component={ErrorText} />
                      </FormColumn>

                      <FormColumn>
                        <RequiredLabel htmlFor="location">
                          Location
                        </RequiredLabel>
                        <Select as="select" id="location" name="location">
                          <option value="">Select Location</option>
                          <option value="location1">Location 1</option>
                          <option value="location2">Location 2</option>
                        </Select>
                        <ErrorMessage name="location" component={ErrorText} />
                      </FormColumn>
                    </FormRow>

                    <FormGroup>
                      <Label htmlFor="expenseDescription">Description</Label>
                      <Input
                        type="text"
                        id="expenseDescription"
                        name="expenseDescription"
                        placeholder="Add a description"
                      />
                    </FormGroup>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "1rem",
                      }}
                    >
                      <AddExpenseButton
                        type="button"
                        style={{
                          backgroundColor: "#f0f0f0",
                          color: "#555",
                          border: "1px solid #ccc",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        + Add Expense Coding
                      </AddExpenseButton>
                    </div>
                  </div>
                </FormSection>

                {/* Comments Section */}
                <FormSection ref={commentsSectionRef} id="comments-section">
                  <SectionHeader>
                    <SectionIcon background="#f4f8ff" color="#2f54eb">
                      💬
                    </SectionIcon>
                    <SectionTitle>Comments</SectionTitle>
                  </SectionHeader>

                  <FormGroup>
                    <TextArea
                      id="comments"
                      name="comments"
                      component="textarea"
                      placeholder="Add a comment and use @name to tag someone"
                    />
                  </FormGroup>
                </FormSection>

                <FooterButtonsContainer>
                  <SaveDraftButton type="button" onClick={handleDraftSave}>
                    Save as Draft
                  </SaveDraftButton>

                  <SubmitButton
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitAndClear}
                  >
                    Submit & New
                  </SubmitButton>
                </FooterButtonsContainer>
              </Form>
            )}
          </Formik>
        </RightColumn>
      </ContentContainer>
    </Container>
  );
};

export default InvoiceForm;
