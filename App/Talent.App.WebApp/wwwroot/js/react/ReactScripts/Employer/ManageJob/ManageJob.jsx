import React from 'react';
import ReactDOM from 'react-dom';
import { Pagination, Icon, Dropdown, Label, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';
import Cookies from 'js-cookie';
import moment from 'moment';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Select } from '../../Form/Select.jsx';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        // console.log("Data In Constructor:" + JSON.stringify(loader)) //{"isLoading":true,"allowedUsers":["Employer","Recruiter"]}

        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            dataFilterOptions: {
                    showActive: true,
                    showClosed: false,
                    showDraft: true,
                    showExpired: true,
                    showUnexpired: true
            },
            sortByData: [
                { key: "newestFirst", value: "desc", title: "Newest First" },
                { key: "oldestFirst", value: "asc", title: "Oldest First" }
            ],
            filterDropdownData: [
                { key: "showactive", value: "showActive", text: "showActive", title: "showActive"},
                { key: "showclosed", value: "showClosed", text: "showClosed", title: "showClosed"},
                { key: "showdraft", value: "showDraft", text: "showDraft", title: "showDraft"},
                { key: "showexpired", value: "showExpired", text: "showExpired", title: "showExpired"},
                { key: "showunexpired", value: "showUnexpired", text: "showUnexpired", title: "showUnexpired"}
            ],
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.getValueByKey = this.getValueByKey.bind(this);
        this.loadSelectOptions = this.loadSelectOptions.bind(this);
        this.handleDropdownDataChange = this.handleDropdownDataChange.bind(this);
        this.handleSelectDataChange = this.handleSelectDataChange.bind(this);
        this.isEmpty = this.isEmpty.bind(this);
        //your functions go here
    };

    handleDropdownDataChange(event, data) {

        var dataValue;
        var dataValueArr = [];
        var filterOptions;

       
      //  dataValue = data.value.toString();
        dataValue = event.target.value;

        filterOptions = {
            showActive: false,
            showClosed: false,
            showDraft: false,
            showExpired: false,
            showUnexpired: false
        };

        if (dataValue !== "") {
            if (dataValue.includes(",")) {
                dataValueArr = dataValue.split(",");
                for (var i = 0; i < dataValueArr.length; i++) {
                    Object.keys(filterOptions).forEach(function (key) {
                        if (key == dataValueArr[i]) {
                            filterOptions[key] = true;
                        }
                    });
                }
            }
            else {
                filterOptions[dataValue] = true;
                console.log("filterOptions[" + dataValue + "] = true");
            }
        }
            // Call setState with 'annonymous callback' function which confirms the execution of the setstate
        this.setState({
            dataFilterOptions: filterOptions
        }, () => {
            console.log(JSON.stringify(this.state.dataFilterOptions));
            this.loadData();
        })

        

    }

   

    handleSelectDataChange(event) {

        var newSortByObj = {
            date: event.target.value ? event.target.value : "desc"
        };

        // 
        this.setState({
            sortBy: newSortByObj 
        }, () => {
            console.log("SortBy: " + this.state.sortBy.date);
            this.loadData();
        })

    }


    // Loads the options for the 'dataFilterOptions' dropdown
    loadSelectOptions() {
        let selectOptions = [];
        let sourceData = null;
            sourceData = this.state.dataFilterOptions;
            selectOptions.push(<option key="" value=""></option>);
            Object.keys(sourceData).forEach(function (key) {
                selectOptions.push(<option key={key.toLocaleLowerCase()} value={key}> {key} </option>);
            });
            this.setState({ filterDropdownOptions: selectOptions });
    }

    // Existing Function
    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });

        this.loadNewData(this.state.loadJobs);

        // set loaderData.isLoading to false after getting data
        // this.loadData(() =>
        //    this.setState({ loaderData })
        //)

        // {"isLoading":true,"allowedUsers":["Employer","Recruiter"]}
        // console.log("Init Function: " + JSON.stringify(this.state.loaderData))
    }

    // Existing Function
    componentDidMount() {
        this.init();
      //  this.loadSelectOptions();
    };

    // Existing Function
    loadData(callback) {

        // getSortedEmployerJobs
        // Original Code
        // var link = 'http://localhost:51689/listing/listing/GetEmployerJobs';

        var functionParameters = this.state.dataFilterOptions;
        functionParameters["activePage"] = this.state.activePage.toString();
        functionParameters["sortbyDate"] = this.state.sortBy.date.toString();
            
        

        console.log("functionParameters = " + JSON.stringify(functionParameters));

        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');

       // console.log("load data function called...  " + cookies);
        // your ajax call and other logic goes here
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            type: 'post',
            data: JSON.stringify(functionParameters),
            success: function (res) {
                console.log("Total Returned Data: " + res.totalCount);
                this.updateWithoutSave(res.myJobs);
            }.bind(this),
            error: function (err) {
                alert("Error: \n\n" + JSON.stringify(err));
            }
        })

    }

    //updates component's state without saving data
    updateWithoutSave(newValues) {
        // console.log("Data transferred: updateWithoutSave (newValues)" + JSON.stringify(newValues));
        let jobsList = Object.assign({}, newValues)
        this.setState({
            loadJobs: jobsList
        }, () => { console.log("Main Dataset Updated") })
        // console.log("updateWithoutSave (loadJobs)" + JSON.stringify(this.state.loadJobs));
    }

    // Existing Function - calls the loadData() function which retrieves the data from the controller
    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    //loadData: loader  // Original Code
                    loaderData: loader
                })
            })
        });

//        console.log("Inside loadNewData Function: loadData = " + JSON.stringify(this.state.loaderData))
    }

    // Checks if a 'JSON' object is empty...
    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }


    //return the value from 2nd field, by searching values of first field
    getValueByKey(currentRecord, keyToSearch) {

        let retValue = "";
        let locationElement;
        // iterate over each element in the array - (Implement using 'FOREACH' loop pending)

// THE BELOW CODE WORKS CORRECTLY FOR THIS PURPOSE BUT COMMENTED TO USE THE CODE BELOW THAT
        //for (var field in currentRecord) {
        //    if (currentRecord.hasOwnProperty(field)) {
        //        console.log("For Loop Field: " + field + " , Value: " + currentRecord[field] + "\n");
        //    }
        //}    

        // ITERATE THROUGH AN OBJECT AND RETURN THE VALUES OF THE FIELDS
        Object.keys(currentRecord).forEach(function (key) {
            //console.log('Object.key : ' + key + ', Value : ' + currentRecord[key])
            if (key == keyToSearch) {
                if (key != 'location') {
                    retValue = currentRecord[key];
                }
                else {
                    // As "currentRecord['location']" is an object, pass it to a variable first and let that variable become an object
                    locationElement = currentRecord['location'];
                    retValue = locationElement["city"] + ", " + locationElement["country"];
//                    console.log(retValue);
                }
            }
        })
        return retValue;

    }

    // Existing Function
    render() {

        let jobSummaryData = this.state.loadJobs;
        let jobSummaryCards = [];
        let currentRecord = null;
        let isJobExpired;

        if (jobSummaryData == "") {
            jobSummaryCards = "Loading Jobs..."
        }
        else {
            for (var dataRow in jobSummaryData) {
                currentRecord = jobSummaryData[dataRow];
                // will check for empty strings (""), null, undefined, false and the numbers 0 and NaN
                if (Object.keys(currentRecord).length == 0) {
                    jobSummaryCards = "No Jobs Found";
                }
                else {
                    isJobExpired = ((moment(currentRecord['expiryDate']) > 0) ? (moment(currentRecord['expiryDate']) > moment() ? false : true) : true);
                    jobSummaryCards.push(< JobSummaryCard key={currentRecord['id']} isJobExpired={isJobExpired} jobId={currentRecord['id']} jobTitle={currentRecord['title']} jobSummary={currentRecord['summary']} jobLocation={currentRecord.location["city"] + ", " + currentRecord.location["country"]} />);
                }
            }
        }

        return (
            <React.Fragment>
                <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                    <div className="ui container">
                        <div className="ui grid">
                            <div className="row">
                                <div className="sixteen wide left aligned padded column">
                                    <h1>List of Jobs</h1>
                                </div>
                            </div>
                            <div className="row">
                                <div className="three wide column">
                                    <span className="left floated">
                                        <i aria-hidden="true" className="filter icon"></i> Filter:  </span>
                                    <span className="right floated">
                                        <Select name="dataFilter" placeholder="Choose filter:" options={this.state.filterDropdownData} controlFunc={this.handleDropdownDataChange} className="inline-select"></Select>
                                    </span>
                                </div>
                                <div className="five wide column">
                                    <span className="left floated">
                                        <Icon name='calendar alternate outline' /> Sort by date:  </span>
                                    <span className="right floated">
                                        <Select name="sortBy" options={this.state.sortByData} controlFunc={this.handleSelectDataChange} placeholder="Choose filter:" className="inline-select"></Select>
                                    </span>
                                </div>
                            </div>
                            <div className="row">
                                {jobSummaryCards}
                            </div>
                        </div>
                    </div>
                </BodyWrapper>
            </React.Fragment>
        )
    }
}