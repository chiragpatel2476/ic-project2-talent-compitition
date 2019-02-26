import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.closeJob = this.closeJob.bind(this);
        this.copyJob = this.copyJob.bind(this);
        this.editJob = this.editJob.bind(this);
    }

    closeJob(jobId) {

        var link = 'http://localhost:51689/listing/listing/closeJob';
        var cookies = Cookies.get('talentAuthToken');        

        var userPrompt = confirm("Please confirm if the job with id = " + jobId + " to be closed");

        if (userPrompt) {
            // your ajax call and other logic goes here
            $.ajax({
                url: link,
                type: "POST",
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                processData: false,
                data: JSON.stringify({ "id": jobId }),
                success: function (res) {
                    if (res.success == true) {
                        alert("SUCCESS: " + JSON.stringify(res.message));
                    }
                }.bind(this),
                error: function (err) {
                    alert("ERROR: " + JSON.stringify(err));
                }.bind(this)
            })
        }

    }

    // /PostJob/:copyId?
    copyJob(jobId) {
        if (jobId != "") {
            window.location = "/PostJob/" + jobId;
        }
    }

    copyJob2(jobId) {

        // This function directly allows to Copy the existing job without displaying details about the selected job.
        // To display details about the currently selected job and to be allowed to be edit the details
        // simply provide [window.location = "/PostJob/" + jobId] code to this function

        var link = 'http://localhost:51689/listing/listing/copyExistingJob';
        var cookies = Cookies.get('talentAuthToken');

        var userPrompt = confirm("Please confirm if you want to copy the job with id = " + jobId);

        if (userPrompt) {
            // your ajax call and other logic goes here
            $.ajax({
                url: link,
                type: "POST",
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                processData: false,
                data: JSON.stringify({ "id": jobId }),
                success: function (res) {
                    if (res.success == true) {
                        alert("Job with id = " + jobId + " has cloaned successfully");
                        window.location = "/ManageJob";
                    }
                }.bind(this),
                error: function (err) {
                    alert("ERROR: " + JSON.stringify(err));
                }.bind(this)
            })
        }

    }

    // /EditJob/:id
    editJob(jobId) {
        if (jobId != "") {
            window.location = "/EditJob/" + jobId
        }
    }

    render() {
        // Intialize or assign variables here - 
        const { jobId, jobTitle, jobSummary, jobLocation, isJobExpired } = this.props;
//        console.log("iside JobSummaryCard - Render Method: (loadJobs) = " + loadJobs);
        let jobExpiredLabelClass = (isJobExpired == true) ? "ui left floated buttons" : "hide-control";
        // rendering things here...
        return (
            <div className="job-block" >
                <div className="row jobtitle-row">
                    <div className="content">
                         <h3>{jobTitle}</h3>
                    </div>
                </div>
                <div className="row jobdescription-row">
                    <div className="content">
                        <div className="body">
                            <p>{jobLocation}</p>
                            <p>{jobSummary}</p>
                        </div>
                    </div>
                </div>
                <div className="row jobbuttons-row">
                    <div className={jobExpiredLabelClass}>
                        <label className="ui red label">Expired</label>
                    </div>
                    <div className="ui right floated buttons">
                        <button className="ui icon button" onClick={this.closeJob.bind(this, jobId)}><i aria-hidden="true" className="ban icon"></i> Close</button>
                        <button className="ui icon button" onClick={this.editJob.bind(this, jobId)}><i aria-hidden="true" className="edit outline icon"></i> Edit</button>
                        <button className="ui icon button" onClick={this.copyJob.bind(this, jobId)}><i aria-hidden="true" className="copy outline icon"></i> Copy</button>
                    </div>
                </div>
            </div>
        )
    }
}