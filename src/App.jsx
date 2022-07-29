import React, { useState } from "react";
import Papa from "papaparse";
// import Table from "./components/table";
import "./App.css"
import '@fortawesome/fontawesome-free/js/all.js';
import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom } from '@fortawesome/free-solid-svg-icons'
// import { doSearch } from "./SearchPDF"
// import tika from "node-tika"



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSWi8teKhljadePNuQWN9WFn2Lbx1QuE4",
  authDomain: "agenda-monitoring.firebaseapp.com",
  projectId: "agenda-monitoring",
  storageBucket: "agenda-monitoring.appspot.com",
  messagingSenderId: "367635128406",
  appId: "1:367635128406:web:3debe8eabc78750ff11bf7",
  measurementId: "G-WYXCHMLTJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const App = () => {

  // This state will store the parsed data
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate, setEndDate] = useState('2022-07-06');
  const [searchText, setSearchText] = useState('');


  const [tableData, setTableData] = useState([
    { Date: "", Location: "", Meeting: "", DocTitle: "", PDF: "", Video: "", Link: "", Keywords: "" },
  ]);
  const [curTableData, setCurTableData] = useState([
    { Date: "", Location: "", Meeting: "", DocTitle: "", PDF: "", Video: "", Link: "", Keywords: "" },
  ]);
  const [curSearchTableData, setCurSearchTableData] = useState([
    { Date: "", Location: "", Meeting: "", DocTitle: "", PDF: "", Video: "", Link: "", Keywords: "" },
  ]);

  const [curCities, setCurCities] = useState([{ City: "" }])
  var parsedData = [
    { Date: "", Location: "", Meeting: "", DocTitle: "", PDF: "", Video: "", Link: "", Keywords: "" },
  ];
  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };
  const handleParse = () => {

    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      parsedData = csv?.data;
      setTableData(parsedData)
      setCurTableData(parsedData)
      setCurSearchTableData(parsedData)
      const columns = Object.keys(parsedData[0]);
    };
    reader.readAsText(file);
  };
  function isInDateRange(date) {
    var formatDate = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6)
    var curDate = new Date(formatDate)
    var start = new Date(startDate)
    var end = new Date(endDate)

    return curDate >= start && curDate <= end;
  }

  const updateTableContent = () => {
    var newTableData = []
    var cities = []
    for (let i = 0; i < curSearchTableData.length; i++) {
      if (isInDateRange(curSearchTableData[i].Date)) {
        newTableData.push(curSearchTableData[i])
        if (!cities.includes(curSearchTableData[i].Location)) {
          cities.push(curSearchTableData[i].Location)
        }
      }
    }
    setCurCities(cities)
    setCurTableData(newTableData)
  }

  const updateStartDate = event => {
    setStartDate(event.target.value)
  }

  function containsWord(keywords) {
    return keywords.includes(searchText)
  }

  const updateTableResults = () => {
    var newTableData = []
    for (let i = 0; i < tableData.length - 1; i++) {
      if (containsWord(tableData[i].Keywords)) {
        newTableData.push(tableData[i])
      }
    }
    setCurSearchTableData(newTableData)
    setCurTableData(newTableData)
  }

  const updateSearchText = event => {
    setSearchText(event.target.value)
  }
  const updateEndDate = event => {
    setEndDate(event.target.value)
  }
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      updateTableResults()
    }
  }

  function formatDate(date) {
    var year = date.substring(0, 4)
    var month = date.substring(4, 6)
    var day = date.substring(6)
    return month + "/" + day + "/" + year
  }

  function videoColDisplay(link) {
    if (link == "None") {
      return ""
    }
    else {
      return <FontAwesomeIcon className="Link" icon="fa-solid fa-link" />
    }
  }



  useEffect(() => {
    updateTableContent();
  }, [endDate, startDate]);

  function Table() {
    return (
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>Meeting</th>
              <th>Doc Title</th>
              <th>Video</th>
            </tr>
            {curTableData.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{formatDate(val.Date)}</td>
                  <td>{val.Location}</td>
                  <td>{val.Meeting}</td>
                  <td>
                    <a href={val.PDF}>
                      <div>{val.DocTitle}</div>
                    </a>
                  </td>

                  <td>
                    <a href={val.Link}>
                      <div>{videoColDisplay(val.Link)}</div>
                    </a>
                  </td>
                </tr>
              )
            })}
          </thead>
        </table>
      </div>
    );
  }

  return (
    <>
      <div className="input">
        <label htmlFor="csvInput" style={{ display: "block" }}>
          Enter CSV File
        </label>
        <input
          onChange={handleFileChange}
          id="csvInput"
          name="file"
          type="File"
        />
        <div>
          <button onClick={handleParse}>Parse</button>
        </div>
        <div style={{ marginTop: "3rem" }}>
          {error ? error : data.map((col,
            idx) => <div key={idx}>{col}</div>)}
        </div>
      </div>

      <div className="Tools">
        <div className="Dates">
          <div className="Start">
            <h3>Start</h3>
            <input type="date" onChange={updateStartDate} value={startDate}></input>
          </div>
          <div className="End">
            <h3>End</h3>
            <input type="date" onChange={updateEndDate} value={endDate}></input>
          </div>
          <div className="City">
            <h3>Location</h3>
            <select id="cars" name="cars">
              <option>Austin</option>
            </select>
          </div>
        </div>

        <div className="Search">
          <input type="text" onChange={updateSearchText} value={searchText} onKeyDown={handleKeyDown} placeholder="Search for Keywords"></input>
          <button onClick={updateTableResults}><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /></button>
        </div>
      </div>
      <Table data={parsedData} />
    </>
  );
};



export default App;
