/**************************************************************************************************************/
/**************************************************************************************************************/
/* This Javascript file is the single locaiton for all customer LAAD javascript methods to reside.  The 
/* file is divided by functional groups, for the most part, and applies to all WebReports and Forms that LAAD
/* uses within the Content Server application.

/* Author: Brian Overly, Robert Kraai, Martina Remirez, Allen Elliot
/* Date: 3/1/2015
/* Release: 1.0 - 4/29/2015  - Disbursement Form Views
/* Release: 1.5 - 7/1/2015   - Disbursement WebReport Views
/* Release: 2.0 - 10/10/2015 - Updates to Disbursement Views and Dashboard for Field Offices
/* Release: 3.0 - 3/25/2016  - Cleanup and Updates to Disbursement Views, and addition of Loan Proposal Views and WebReports

/* TODO Need to Cleanup/Comment and bring in the inline script before 3.0 is released
/**************************************************************************************************************/
/**************************************************************************************************************/

/* Global Variables */
var javascriptVersion = 20170228;
var LAAD_DEBUG = true; /* Used to turn logging on or off.  Turn off in production */
var disbursementForm = false; /* Used to indicate that this is a Disbursement form */
var loanProposalForm = false; /* Used to indicate that this is a Loan form */
var expenseRequisitionForm = false; /* Used to indicate this is a Requisition Form */
var iccApprovalAppForm = false; /* Used to indicate this is a ICC Approval APP Form */
var failedValidationFields = "";  /* Used in messaging for failed required fields */

function verifyViewVersion() {
  if (typeof screenFormVersion == 'undefined' || (screenFormVersion != javascriptVersion)) {
    $.blockUI({
        message: '<h1 id="myMessage">Your screen version does not match.</br>Please Perform Ctrl-F5 Refresh.</h1>'
    });  
  }
}

/*Function to perform the workspace lookup for the Disbursement screen field 69 and 73*/
function doSelectNode_69( formname, fieldprefix ) {
  log("Method: doSelectNode_69");
  var w;
  var workspaceParent = $("#LL_BPWorkspaceParent").val();
  w = window.open("/otcs/llisapi.dll?func=ll&objID=" + workspaceParent + "&objAction=targetBrowse&headerLabel=Select%20Item&selectLabel=Select&selectScreen%3D%7B848%7D&formname=" + formname + "&fieldprefix=" + fieldprefix + "" ,"SelectWidget","width=600,height=360,resizable=yes,menubar=no,scrollbars=yes,toolbar=no")

  if ( w.focus ) {
    w.focus();
  }
}

/*Callback function to assign the nodeid and path for the Disbursement screen field 69 and 73*/
function _1_1_69_1_DoSelection( nodeid, nodepath ) {
  log("Method: _1_1_69_1_DoSelection");
  document.myForm._1_1_69_1.value = nodeid;
  document.myForm._1_1_73_1.value = nodepath;
  if($("#_1_1_73_1").val() != ""){
    enableBPBWpathBtns();	
  }
  markDirty();
}


/*Function to perform the workspace lookup for the Disbursement screen field 174 and 177*/
function doSelectNode_174( formname, fieldprefix ) {
  log("Method: doSelectNode_174");
  var w;
  var workspaceParent = $("#LL_BPWorkspaceParent").val();
  w = window.open("/otcs/llisapi.dll?func=ll&objID=" + workspaceParent + "&objAction=targetBrowse&headerLabel=Select%20Item&selectLabel=Select&selectScreen%3D%7B848%7D&formname=" + formname + "&fieldprefix=" + fieldprefix + "" ,"SelectWidget","width=600,height=360,resizable=yes,menubar=no,scrollbars=yes,toolbar=no")

  if ( w.focus ) {
    w.focus();
  }
}

/*Callback function to assign the nodeid and path for the Disbursement screen field 174 and 177*/
function _1_1_174_1_DoSelection( nodeid, nodepath ) {
  log("Method: _1_1_174_1_DoSelection");
  document.myForm._1_1_174_1.value = nodeid;
  document.myForm._1_1_177_1.value = nodepath;
  if($("#_1_1_177_1").val() != ""){
    enableBPBWpathBtns();	
  }
  markDirty();
}

/* validates the the system can allow a file move befpore calling the action */
function doMoveFiles(cgiPath, moveFilesPopupWRID, workflowID){
  log("Method: doMoveFiles");
  var message="";
  var bpPath = $(field_BP_Workspace_Path).val();

  if (!validateBPBW()) {
    if(($(field_Status).val() == "Operations Completes Disbursement") || ($(field_Status).val() == "Operations Disbursement Review")){
      message = message + "<p>BP number does not match Business Workspace.  Please choose the correct match.</p>";
    } else {
      message = message + "<p>BP number does not match Business Workspace.  (<a href=\"javascript:sendToLink('Operations')\">Click here to send to Operations to correct.</a>)</p>";
    }
  showErrorMessage(message);
  }
  else {
  hideErrorMessage();
    if (bpPath != "") {
    doMoveFilesAction(cgiPath, moveFilesPopupWRID, workflowID);
  }
  }
}

/** sets up the call to the web report that will move files from the Attachments to the Bp Workspace.*/
function doMoveFilesAction(cgiPath, moveFilesPopupWRID, workflowID){
}

/* Delete the file specified in the parameter */
function deleteAttachment(dataid, name){
}

/* Determine if there are attachments in the attachments folder */
function findAttachments(){
}

/* Process the result from the attachment search, and if the message is not already there, add the error message.  Otherwise, remove it. */
function updateMessagesForAttachments(data, status) {
  log("Method: updateMessagesForAttachments");
  var messages = $("#Messages_Section").html();
  if (data.indexOf("Documents found in folder") > -1) {
    if (messages.indexOf(attachmentMessage) == -1) {
      messages += attachmentMessage;
      showErrorMessage(messages);
    }
  }
  else {
    var position = messages.indexOf(attachmentMessage);
    if (position > -1) {
      messages = messages.substr(0, position) + messages.substr(position + attachmentMessage.length, messages.length);
      if (messages.trim() == "") {
        hideErrorMessage();
      }
      else {
        showErrorMessage(messages);
      }
    }
  }
  attachmentSubmitWait = "";
}

function updateMessagesForErrors(request, status, error) {
  log("Method: updateMessagesForErrors");
  updateMessagesForAttachments(request.statusText, status);
}

function checkForByPassValidation( currentStep, sentToStep ){
  log("Method: checkForByPassValidation");
  
  var doBypass = (getStepNumber(currentStep) >= getStepNumber(sentToStep)) ?  true : false;
  
  return doBypass;
}

/* update the referral step fields */
function checkForSendToReferral( currentStep ){
  log("Method: checkForSendToReferral");
  var formIsValid = false;

  for (var i = 0; i < field_Referrals.length; i++) {
    var referral = $(field_Referrals[i]).val();
    if (!referral || referral == currentStep || referral == "?") {
      $(field_Referrals[i]).val(currentStep);
      formIsValid = true;
      break;
    }
  }
  
  return formIsValid;
}

/* are there referral step fields */
function hasSendToReferral(){
  log("Method: hasSendToReferral");
  var hasReferral = false;

  for (var i = 0; i < field_Referrals.length; i++) {
    var referral = $(field_Referrals[i]).val();
    if (referral && referral != "?") {
      hasReferral = true;
      break;
    }
  }
  return hasReferral;
}

/* clear the referral step fields */
function clearSendToReferral(){
  log("Method: clearSendToReferral");
  for (var i = 0; i < field_Referrals.length; i++) {
    $(field_Referrals[i]).val("");
  }
}

/* Determine the proper Action and Subaction */
function checkProperActionSubaction(currentStep) {
  var formIsValid = true;
  if (loanProposalForm) {
    if ($(field_Action).val() == "Proposal_SendTo") {
      if (checkForSendToReferral(currentStep)) {
        $(field_Action).val($('#SendTo_Select').val());
        $(field_Subaction).val("SendTo");
      }
      else {
        formIsValid = false;
      }
    }
    else if ($(field_Action).val() == "Proposal_Return") {
      $(field_Subaction).val("ReturnTo");
    }
    else if ($(field_Action).val() == "Proposal_Submit") {
      $(field_Subaction).val("");
    }
    else if ($(field_Action).val() == "Proposal_Cancel") {
      $(field_Subaction).val("Cancel");
      if (parentWorkflowID) {
        $(field_Child_Cancelled).val("1");
      }
    }
    else {
      $(field_Subaction).val("");
    }
  }
  return formIsValid;
}

/* Submit function called by the buttons to perform an action and close the screen */
function doSubmit(action) {
}

/* Called before the step goes to another step/state that the proper signatures are in place for the target step */
function checkSendToSignatures(sentTo){
  log("Method: checkSendToSignatures");
  
  if(sentTo == "MgmtII"){
    if(!$("#_1_1_26_1_checkbox").is(':checked')){ return false } // Operations
    if(!$("#_1_1_55_1_checkbox").is(':checked')){ return false } // Compliance
    if(!$("#_1_1_29_1_checkbox").is(':checked')){ return false } // Loan Officer
    if(!$("#_1_1_31_1_checkbox").is(':checked')){ return false } // Accounting
    if(!$("#_1_1_33_1_checkbox").is(':checked')){ return false } // Mgmt 1st Release
  }
  if(sentTo == "MgmtI"){
    if(!$("#_1_1_26_1_checkbox").is(':checked')){ return false } // Operations
    if(!$("#_1_1_55_1_checkbox").is(':checked')){ return false } // Compliance
    if(!$("#_1_1_29_1_checkbox").is(':checked')){ return false } // Loan Officer
    if(!$("#_1_1_31_1_checkbox").is(':checked')){ return false } // Accounting
  }
  if(sentTo == "Accounting"){
    if(!$("#_1_1_26_1_checkbox").is(':checked')){ return false } // Operations
    if(!$("#_1_1_55_1_checkbox").is(':checked')){ return false } // Compliance
    if(!$("#_1_1_29_1_checkbox").is(':checked')){ return false } // Loan Officer
  }
  if(sentTo == "LoanOfficer"){
    if(!$("#_1_1_26_1_checkbox").is(':checked')){ return false } // Operations
    if(!$("#_1_1_55_1_checkbox").is(':checked')){ return false } // Compliance
  }
  if(sentTo == "Compliance"){
    if(!$("#_1_1_26_1_checkbox").is(':checked')){ return false } // Operations
  }
  
  return true;
     
}

/* Shows the Message section at the top of the screen, called if there are messages to display */
function showErrorMessage(message){
  log("Method: showErrorMessage");
  $("#Messages_Section").html(message);
  $("#Messages_Section").show();
  $("#asterisk").focus();
}

/* Hide the error message */
function hideErrorMessage(){
  log("Method: hideErrorMessage");
  $("#Messages_Section").html("");
  $("#Messages_Section").hide();
}

/*Format the number (if it is a number) and add the listener.*/
function formatAmount(amountField, formatType, addListener) {
  $(amountField).val(formatAmountNumber($(amountField).val(), formatType));

  //Add the keyup listener so that the currency format is working on the screen
  if (addListener) {
    $(amountField).keyup(function(event) {
      var pos = $(amountField).getCursorPosition();
      var originalLength = $(this).val().length;
      // skip for arrow keys
      if((event.which >= 37 && event.which <= 40) || event.which == 16){
        event.preventDefault();
      }
      else {
        $(this).val(function(index, value) {
          return value
            .replace(/\D/g, "")
            .replace(/([0-9])([0-9]{2})$/, '$1.$2')  
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
        });
        var newLength = $(this).val().length;
        if (newLength > originalLength && !(event.which == 46)) {pos++;}
        else if (newLength < originalLength) {pos--;}
        $(amountField).setCursorPosition(pos);
      }
    });
  }
}

/*Format the number (if it is a number).*/
function formatAmountNumber(amountField, formatType) {
  var result = amountField;
  if (!amountField || amountField.match(/[a-z]/i)) {
    //Ignore if it already has characters
  }
  else {
    if (amountField.indexOf(".") < 0) {
      amountField += '.00';
    }
    else if (amountField.indexOf(".") == amountField.length - 2) {
      amountField += '0';
    }
    else if (amountField.indexOf(".") == amountField.length - 1) {
      amountField += '00';
    }
    if (formatType == "real") {
      //leave only numbers and decimal
      result = amountField.replace(/[^0-9\.]+/g, '');
    }
    if (formatType == "currency") {
      //reformat with commas and decimal
      result = amountField
        .replace(/\D/g, "")
        .replace(/([0-9])([0-9]{2})$/, '$1.$2')  
        .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ",");
    }    
  }
  return result;
}

/* blocks the user from input with an overlay, enables all fields, and performs the submit */
function doSubmitPostForm(){
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                                          /* Custom Validation Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/
function doesFormValidate() {
  log("Method: doesFormValidate");

  var formIsValid = true;
  var message = "";
  failedValidationFields = "";

  hideErrorMessage();
  
  if (!validateRequired()) {
    message = "<p>Please fill in the required fields</p>";
    message = message + "<p>" + failedValidationFields;
    if (disbursementForm) {
      message += " (<a href=\"javascript:sendToLink('Operations')\">Click here to send to Operations</a> or <a href=\"javascript:sendToLink('LoanOfficer')\">Click here to send to Loan Officer</a> to correct.)</p>";
    }
    formIsValid = false;
  }
  
  if (!expenseRequisitionForm && !validateBPBW()) {
    var currentStatus = $(field_Status).val();
    if ((currentStatus == "Operations Completes Disbursement") || (currentStatus == "Operations Disbursement Review")) {
      message = message + "<p>BP number does not match Business Workspace.  Please choose the correct match.</p>";
    } else {
      message = message + "<p>BP number does not match Business Workspace.  (<a href=\"javascript:sendToLink('Operations')\">Click here to send to Operations to correct.</a>)</p>";
    }
    formIsValid = false;
  }
  
  if (loanProposalForm && !validateFieldOfficeAssignments()) {
    message = message + "<p>Selected Field Office has invalid workflow assignments and must be maintained before use.</p>";
    formIsValid = false;
  }
  
  if (expenseRequisitionForm && !validateDeny()) {
    message = message + "<p>You must fill in a denial reason, if you are denying the request.</p>";
    formIsValid = false;
  }
  
  if (expenseRequisitionForm && !validateRequisitionSignatures()) {
    message = message + "<p>You must check the approval box to electronically sign, if you submit the form.</p>";
    formIsValid = false;
  }
  
  if (disbursementForm && !validateSignatures()) {
    message = message + "<p>All Signers must indicate approval before the disbursement can proceed to Post.  (Send To the steps that are missing approval to correct.)</p>";
    formIsValid = false;
  }
  
  if ((disbursementForm || loanProposalForm) && !validateImportantComment()) {
    message = message + "<p>An Important comment needs to be reviewed prior to submitting the form.  Uncheck the Important Comment checkbox to proceed.</p>";
    formIsValid = false;
  }

  if (loanProposalForm && !checkProperActionSubaction($(field_Status).val())) {
    message = message + "<p>The maximum number of referrals has been reached.  You must refer back to prior steps or submit the form.</p>";
    formIsValid = false;
  }
  
  if (loanProposalForm && !validateNotRecommended()) {
    message = message + "<p>You must fill in a reason for not recommending or cancelling the request.</p>";
    formIsValid = false;
  }

  if (loanProposalForm && !validateTotalAmount()) {
    message = message + "<p>The maximum amount for Total Amount has been exceeded.  Total must be less than or equal to 5,000,000.00.</p>";
    formIsValid = false;
  }

  if (loanProposalForm && !validateGroupAmount()) {
    message = message + "<p>The maximum amount for Group Amount has been exceeded.  Total must be less than or equal to 9,000,000.00.</p>";
    formIsValid = false;
  }
  
  if (disbursementForm && !setLoanAsFullyDisbursed()) {
    message = message + "<p>An error occured while attempting to set the selected Loan Proposal to Fully Disbursed.</p>";
    formIsValid = false;
  }
  
  if (!formIsValid) {
    showErrorMessage(message);
  }

  return formIsValid;
}

/* Step through all required fields and determine if they have a value */
function validateRequired() {
  log("Method: validateRequired");
  var result = true;
  $("select.required, input.required, textarea.required").each(function(i, obj) {

    if($(this).val() == "" || $(this).val() == "<Select One>"){
      $(this).addClass('required-error');
      if ($(this).attr('title') == 'BP Name') {
        $('#BP_Selector').addClass('required-error');
      }
      updateFailedFields($(this).attr('title'));
      result = false
    }

    //For each field that fails validation, add the Red background */
    $(this).change(function() {
      $(this).removeClass('required-error');
      $(this).unbind( "change" );
    });
    $(this).click(function() {
      $(this).removeClass('required-error');
      $(this).unbind( "click" );
    });

  });
  return result;
}

/*Update the failed fields with the new field title and a comma if needed */
function updateFailedFields(fieldTitle) {
  log("Method: updateFailedFields");
  if (fieldTitle) {
    if (failedValidationFields) {
      failedValidationFields += ", ";
    }
    failedValidationFields += fieldTitle;
  }
}

function validateTotalAmount() {
  log("Method: validateTotalAmount");
  
  if (formatAmountNumber($(field_Total_Exposure).val(), 'real') > 5000000.00) {
    return false;
  }
  return true;
}

function validateGroupAmount() {
  log("Method: validateGroupAmount");
  
  if (formatAmountNumber($(field_Group_Exposure).val(), 'real') > 9000000.00) {
    return false;
  }
  return true;
}

/* Determine if the BP Number field is represented in teh BP Workspace Path.  If it is not, then return false.*/
function validateBPBW(){
  log("Method: validateBPBW");
  var status = $(field_Status).val();
  var bpPath = $(field_BP_Workspace_Path).val();
  var bpNumber = $(field_BP_Number).val();
  var isValid = true;

  if (bpNumber != "" || bpPath != "") {
//No longer need to check in Operations and validate change since system sets the workspace.    
//    if ((status == "Operations Completes Disbursement" || status == "Operations Disbursement Review") || !(validateBPNumberChanged())) {
    if (bpPath.toLowerCase().indexOf(padField(bpNumber, 10)) == -1) {
      // ERROR
      $(field_BP_Workspace_Path).addClass("required");
      isValid = false;
    }
//    }
  }
  return isValid;
}

/*Return the check of field office selection to be sure all groups used are set.*/
function validateFieldOfficeAssignments() {
  return true;//($(field_Regional_VP + "_ID").val() && $(field_Country_Manager + "_ID").val() && $(field_Assistant_Manager + "_ID").val() && $(field_Field_Office_Admin + "_ID").val()); 
}

/* Pad the field passed to this funtion with a character to make it 'wide'.  The character will default to 0*/
function padField(n, width, z) {
  log("Method: padField");
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

/* Validate that BP number changes cause a system comment and routing back to Operations in the Disbursement Process*/
/*DEPRECATED since workspace is now set by the system*/
//function validateBPNumberChanged() {
//  var status = $(field_Status).val();
//  var comment = $(field_Comments).val();
//  var oldBP = $("#LL_SavedBPNumber").val();
//  var newBP = $(field_BP_Number).val();
//  if ((status != "Operations Completes Disbursement") || (status != "Operations Disbursement Review")) {
//    if (oldBP != newBP) {
//      if (comment) {
//        comment = comment + "\r\n";
//      } //end if comment field
//      comment = comment + getDateTime() + " | " + "SYSTEM NOTE: New BP Number requires the BP Workspace to be set by Operations from " + status;
//      $(field_Comments).val(comment);
//      $(field_Action).val("Operations");
//      return true;
//    } //end if BP Number
//  } //end If Operations
//  return false;
//}

function validateSignatures(){
  log("Method: validateSignatures");
  var status = $(field_Status).val();
  var action = $(field_Action).val();

  if (status == "Management II Review" && action == "Submit") {
    if(!$("#_1_1_26_1_checkbox").is(':checked')){ //operations
      return false;
    }
    if(!$("#_1_1_55_1_checkbox").is(':checked')){ //compliance
      return false;
    }
    if(!$("#_1_1_29_1_checkbox").is(':checked')){ //loanOfficer
      return false;
    }
    if(!$("#_1_1_31_1_checkbox").is(':checked')){ //accounting
      return false;
    }
    if(!$("#_1_1_33_1_checkbox").is(':checked')){ //managementI
      return false;
    }
    if(!$("#_1_1_35_1_checkbox").is(':checked')){ //managementII
      return false;
    }
  }
  return true;
}

/* Validate that the last signature has been checked */
function validateRequisitionSignatures(){
  log("Method: validateRequisitionSignatures");
  var action = $(field_Action).val();

  if (formStatusTag == "Expense Requisition Approval" && action == "Requisition_Submit") {
    var lastSignature = $(field_Number_Of_Signatures).val();
    if(!$("#_1_1_16_" + lastSignature + "_17_1_checkbox").is(':checked')){ //last signature
      return false;
    }
  }
  return true;
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                                          /* END Custom Validation Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/



/* Provide the Lookup for the Field Office */
/*DEPRECATED legacy field office popup*/
//function selectFieldOffice() {
//   var      w;
//   var      url;
//
//   url = "/otcs/llisapi.dll?func=attrtable.StringSelectDialog"
//   url = url + "&formname=myForm";
//   url = url + "&Field=_1_1_8_1";
//   url = url + "&AttrID=8";
//   url = url + "&IsForm=true";
//   url = url + "&mapID=0";
//   url = url + "&workID=0";
//   url = url + "&subworkID=0";
//   url = url + "&objID=" + $("#_1_1_XX84_1").val();
//   url = url + "&VerNum=0";
//   url = url + "&CacheID=0";
//   url = url + "&AttrValues=";
//   url = url + "&attrHandler=form";
//
//   w = window.open( url ,"attrTableLookup" , "height=340,width=500,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,status=yes" );
//   if ( w.focus ) {w.focus()}
//}

/* Provide the Lookup for the Field Office Email (will not be used on the main screen)*/
/*DEPRECATED legacy field office email call from field office popup*/
//function selectFieldOfficeEmail() {
//   var      w;
//   var      url;
//
//   url = "/otcs/llisapi.dll?func=attrtable.StringSelectDialog"
//   url = url + "&formname=myForm";
//   url = url + "&Field=_1_1_49_1";
//   url = url + "&AttrID=49";
//   url = url + "&IsForm=true";
//   url = url + "&mapID=0";
//   url = url + "&workID=0";
//   url = url + "&subworkID=0";
//   url = url + "&objID=" + $("#_1_1_XX84_1").val();
//   url = url + "&VerNum=0";
//   url = url + "&CacheID=0";
//   url = url + "&AttrValues=";
//   url = url + "&attrHandler=form";
//
//   w = window.open( url ,"attrTableLookup" , "height=340,width=500,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,status=yes" );
//   if ( w.focus ) {w.focus()}
//}

/* Called to fill in the corresponding User ID field when a Signature Field is checked. */
function populateID (userField) {
  log("Method: populateID");
  // set corresponding field values
  $('#' + userField +'_ID').val($('#LL_UserID').val());
  $('#' + userField +'_Name').val($('#LL_UserFullName').val());
  $('#' + userField +'_SavedName').val($('#LL_UserSavedName').val());
}

/* Called to clear in the corresponding User ID field when a Signature Field is unchecked. */
function clearID (userField) {
  log("Method: clearID");
  // set corresponding field values
  $('#' + userField +'_ID').val("");
  $('#' + userField +'_Name').val("");
  $('#' + userField +'_SavedName').val("");
  $('#' + userField +'_Time').val("");
  if (loanProposalForm) {
    $(field_Subaction).val("");
  }
}

/*Show the Denial section*/
function showDenialSection() {
  log("Method: showDenialSection");
  if ($("#Deny_Section").is(":hidden")) {
    var newLabel = "Close " + $('#DenialButton').val();
    $('#DenialButton').val(newLabel);
    $("#Deny_Section").show();
    $("#SubmitButton").hide();
  }
  else {
    var newLabel = $('#DenialButton').val().replace("Close ", "");
    $('#DenialButton').val(newLabel);
    $("#Deny_Section").hide();
    $("#SubmitButton").show();
  }
  $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
}

/* Called to manage the closing section display */
function hideClosingSection() {
  log("Method: hideClosingSection");
  if ($("#_1_1_70_1_checkbox").is(':checked')){
    $('#Closing_Section').hide();
  }
  else {
    $('#Closing_Section').show();
  }
}

/* Called to manage the display of Signatures that can be skipped */
function hideSpecificSignatureSection(section, sectionDiv) {
  log("Method: hideSpecificSignatureSection");
  if ($(section + "_checkbox").is(':checked')){
    $("#"+sectionDiv).show();
  }
  else {
    $("#"+sectionDiv).hide();
  }
}

function sendToLink(action){
}

function printEdit(){
  log("Method: printEdit");
  $("input").prop("disabled", false); //enabled
  $("#PrintViewPrintButton").hide();
  $("#PrintViewEditButton").hide();
  $("#PrintViewCancelButton").show();
  $("#PrintViewSubmitButton").show();

  $("textarea").show();
  $(".element-textarea .print.hide").hide();
}

function printSubmit(){}

function printCancel(){
  log("Method: printCancel");
  $('input').prop("disabled", true); //disable
  $('#PrintViewButtons input').prop("disabled", false);
  
  $("#PrintViewPrintButton").show();
  $("#PrintViewEditButton").show();
  $("#PrintViewCancelButton").hide();
  $("#PrintViewSubmitButton").hide();

  $("textarea").hide();
  $(".element-textarea .print.hide").show();
}

function makePrintReady(){
  log("Method: makePrintReady");

  $("input:checkbox").attr('disabled', 'disabled'); //disable

  $("#laadform input:text").each(function() {
      var val = $(this).val();
      $(this).replaceWith(val);
  });

  $("#laadform select").each(function() {
      var val = $(this).val();
      $(this).replaceWith(val);
  });

  $("#laadform textarea").each(function() {
      var val = $(this).val();
      $(this).replaceWith(val);
  });
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                                          /* Attachments Section Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/

// enable or disable Show Workspace and Move Files buttons
 function checkBPBWpathBtns(){
   log("Method: checkBPBWpathBtns");

   if($(field_BP_Workspace_Path).val() == ""){
     disableBPBWpathBtns();
   } else {
     enableBPBWpathBtns();
   }
   setBPBWOnChange();
 }

 function setBPBWOnChange(){
   log("Method: setBPBWOnChange");

   var lastValue = $(field_BP_Workspace_Path).val();
   var myTimer = setInterval(function() {
     var pathVal = $(field_BP_Workspace_Path).val();
       if (pathVal != lastValue && pathVal != "") {
           lastValue = pathVal;
           log('I am definitely sure the text box realy realy changed this time');
           enableBPBWpathBtns();
           clearInterval(myTimer);
       }
  }, 1000)
 }

 function enableBPBWpathBtns(){
   log("Method: enableBPBWpathBtns");

   $("#Workspace_Btn").prop('disabled', false);
   $("#MoveFiles").prop('disabled', false);
 }

 function disableBPBWpathBtns(){
   log("Method: disableBPBWpathBtns");

   $("#Workspace_Btn").prop('disabled', true);
   $("#MoveFiles").prop('disabled', true);
 }

/* Show the Attachments Folder in a pop up window for adding files to the workflow */
function showAttachments(type) {
  log("Method: showAttachments");
  var workspaceID = $(field_BP_Workspace_ID).val();
  var action = $(field_Action).val();
  if(type != "attach" && (workspaceID || type=="workspace")){
    log("showAttachments callWorkspaceFolder workspaceID " + workspaceID);
    callWorkspaceFolder(workspaceID);
  }
  else {
    var attURL = document.getElementById('LL_WFATTURL').value;
    var parms = getURLParms(attURL);
    var workID = '0';
    var mapID = false;
    for(var i=0; i<parms.length; i++){
      if (parms[i][0] == 'mapid') {
         workID = parms[i][1];
         mapID = true;
         break;
      }

      if (parms[i][0] == 'workid') {
         workID = parms[i][1];
         break;
      }
    }

    if (mapID) {
      log("showAttachments mapID " + mapID);
      callAttachmentFolder(workID, 'mapid');
    }
    else if (workID != '0') {
      log("showAttachments workID " + workID);
      callAttachmentFolder(workID, 'workid');
    }
    log("showAttachments ELSE ");
  }
}

/* Retrieves parameters from the URL and splits them out. */
function getURLParms(locurl) {
  log("Method: getURLParms");
  var loc =-1;
  var parms = new Array();
  var temp;
  var pairs;
  if (locurl == "") {
    pairs = location.search.split("&");
  } else {
    pairs = locurl.split("&");
  }

  for(var i=0; i<pairs.length; i++){
    loc = pairs[i].indexOf('=');
    if (loc != -1){
      parmName = pairs[i].substring(0,loc);
      parmValue = pairs[i].substring(loc+1);
      temp = new Array();
      temp[0] = parmName;
      temp[1] = parmValue;
      parms.push(temp);
    }
  }
  return parms;
}

/* call to open the attachments folder within the popup window. */
function callAttachmentFolder(wfattid, wftype) {
  log("Method: callAttachmentFolder");

  if(wfattid != undefined) {
    var attURL = ""
    if(wftype == "mapid") {
      attURL = "?func=work.framestarttaskright&mapid=" + wfattid + "&nextURL=&paneindex=4&objAction=Browse&sort=name";
    } else {
      var parms = getURLParms("");
      var tid = 2;
      var subwfid = wfattid;

      for(var i=0; i<parms.length; i++){
        if(parms[i][0] == "subworkid") {
          subwfid = parms[i][1];
        }
        if(parms[i][0] == "taskid") {
          tid = parms[i][1];
        }
      }
      attURL = document.getElementById('LL_WFATTURL').value;
    }

    var mywindow = window.open(attURL, '_blank');
    if(mywindow){
        //Browser has allowed it to be opened
        mywindow.focus();
    }else{
        //Broswer has blocked it
        alert('Please allow popups for this site');
    }
    //mywindow = window.open(attURL, 'Attachments', "height=380,width=700,scrollbars=yes,resizable=yes,menubar=yes");
  } else {
    alert("Error retrieving attachment folder.");
  }
}


/* call to open the business workspace folder within the popup window. */
function callWorkspaceFolder(workspaceID) {
  log("Method: callAttachmentFolder");
  var attURL = "?func=ll&objId=" + workspaceID + "&objAction=browse&viewType=1";

  var mywindow = window.open(attURL, '_blank');
  if(mywindow){
     //Browser has allowed it to be opened
     mywindow.focus();
  } else {
     //Broswer has blocked it
     alert('Please allow popups for this site');
  }
  //mywindow = window.open(attURL, 'Workspace', "height=380,width=700,scrollbars=yes,resizable=yes,menubar=yes");
}

/* Clear the workspace fields and disable workspace buttons */
function clearBPWorkspacePath(){
  $(field_BP_Workspace_ID).val('');
  $(field_BP_Workspace_Path).val('');
  disableBPBWpathBtns();
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                               /* END Attachments Section Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/


/**************************************************************************************************************/
/**************************************************************************************************************/
                               /* Dashboard Helper Methods Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/

/* call the tablesorter plugin*/
function applyTableSorter() {
	$("#DBListing").tablesorter({
		theme: 'blue',
		dateFormat : "mmddyyyy",
		
		headers: {
		  0: { sorter: "digit" },
		  9: { sorter: "shortDate" },
		  10: { filter: false, sorter: false },
		  11: { filter: false, sorter: false }
		},

		// hidden filter input/selects will resize the columns, so try to minimize the change
		widthFixed : true,

		// initialize zebra striping and filter widgets
		widgets: ["zebra", "filter"],

	  // headers: { 5: { sorter: false, filter: false } },
	  widgetOptions : {
			filter_hideFilters : false,
		},
    
    sortList: [[9,1]]
	});
}

/* Calls a web report to load the Dialog. */
function loadDisbursementDialog(disbursementID) {
}

function showSubReportDialog( item ){
  var isVisible = $('#subWrapper').is(':visible');
  var isHidden = $('#subWrapper').is(':hidden');
  if (!isVisible || isHidden) {
    $("#subWrapper").show();
  }
  else {
    $("#subWrapper").hide();
  }
}

function doLoadDetailsData( dataArr, disbursementID ) {
  var ChildWorkflows = [];
  var ChildCompleted = [];
  var ChildPerformer = [];
  var repData2 = dataArr;

  for (var i = 0; i < repData2.length; i++){
    var r = repData2[i][4].toString();
    if(r != ""){
      if (r.indexOf('GMT') == -1) {
        repData2[i][4] += ' GMT-0400';
      }
      
      repData2[i][4] = repData2[i][4].toString().replace("GMT", "UTC");
      var d = new Date(repData2[i][4]);
      repData2[i][4] = d; //d.toLocaleString();
    }
  }
  
  repData2.sort((function(index){
                   return function(a, b){
                            return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
                          };
                 })(4)); // 4 is the index

  var tempLength = repData2.length;
  var temp1 = repData2[tempLength-1];
  var temp2 = repData2[tempLength-2];
  repData2[tempLength-1] = temp2;
  repData2[tempLength-2] = temp1;
  var	s = "";

  for (var i = 0; i < repData2.length; i++){
    var workIndex = containsID(ChildWorkflows, repData2[i][0]);
    PriorRowCompleted = '';
    PriorRowPerformer = '';
    if (workIndex > -1) {
      PriorRowCompleted = ChildCompleted[workIndex];
      PriorRowPerformer = ChildPerformer[workIndex];
    }
    if (workIndex > -1 && ((PriorRowCompleted.toLocaleString() == repData2[i][4].toLocaleString()) && (PriorRowPerformer == repData2[i][2]))){
      if ((repData2[i][8] == "-3") || (repData2[i][8] == "-1")){
        s += '<tr class="'+((i%2==1)?'browseRow1':'browseRow2')+'">'
      } 
      else {
        s += '<tr class="'+((i%2==1)?'browseRow1':'browseRow2')+' bold">'
      }
      s += '<td class="browseItemBPName" nowrap>'+repData2[i][1].replace(/\?/g, '')+'</td>'
      s += '<td><img alt="" border="0" height="1" src="/img/px.gif" width="2"></td>'
      s += '<td class="browseItemBPNumber" nowrap></td>'
      s += '<td><img alt="" border="0" height="1" src="/img/px.gif" width="2"></td>'
      
      if ((repData2[i][8] == "-3") || (repData2[i][8] == "-1")){
        s += '<td class="browseItemLoanNumber" nowrap></td>'
        s += '<td><img alt="" border="0" height="1" src="/img/px.gif" width="2"></td>'
      } 
      else {
        s += '<td class="browseItemLoanNumber" nowrap>Pending</td>'
        s += '<td><img alt="" border="0" height="1" src="/img/px.gif" width="2"></td>'
      }
      
      s += '<td class="browseItemFieldOffice" nowrap></td>'
      s += '</tr>'
    } 
    else {
      s += '<tr class="'+((i%2==1)?'browseRow1':'browseRow2')+'">'
      s += '<td class="browseItemBPName" nowrap>'+repData2[i][1].replace(/\?/g, '')+'</td>'
      s += '<td><img alt="" border="0" height="1" src="/img/px.gif" width="2"></td>'
      s += '<td class="browseItemBPNumber" nowrap>'+repData2[i][2].replace(/\?/g, '')+'</td>'
      s += '<td><img alt="" border="0" height="1" src="/img/px.gif" width="2"></td>'
      s += '<td class="browseItemLoanNumber dateCell" nowrap>'+PriorRowCompleted.toLocaleString()+'</td>'
      s += '<td><img alt="" border="0" height="1" src="/img/px.gif" width="2"></td>'
      s += '<td class="browseItemStartDate dateCell" nowrap>'+repData2[i][4].toLocaleString()+'</td>'
      s += '</tr>'
    }
    if (workIndex == -1) {
      ChildWorkflows.push(repData2[i][0]);
      workIndex = containsID(ChildWorkflows, repData2[i][0]);
    }
    ChildCompleted[workIndex] = repData2[i][4];
    ChildPerformer[workIndex] = repData2[i][2];
  }
  $("#SubTable"+disbursementID).replaceWith(s);
}

function containsID(ChildWorkflows, workID) {
  var index = -1;
  for (var i = 0; i < ChildWorkflows.length; i++) {
    if (ChildWorkflows[i] = workID) {
      index = i;
    }
  }
  return index;
}


function initializeActiveToggle() {
  $("#ActiveToggle").prop('checked', (inactiveWorkflowDisplay != "TRUE"));
  $("#ActiveToggle").click( function(){
    var checked = $(this).is(':checked'); 
    if(checked) {
      window.location.href = baseDashboardURL;
    } 
    else if(!checked) {
      window.location.href = baseDashboardURL + "?inactivewf=true";
    }
  });
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                               /* END Dashboard Helper Methods Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/


/**************************************************************************************************************/
/**************************************************************************************************************/
                                          /* Defaults Section */
/**************************************************************************************************************/
/**************************************************************************************************************/

/* Set all Dashboard Defaults */
function setAllDashboardDefaults() {
  log("Method: setAllDashboardDefaults");
  verifyViewVersion();

  initializeActiveToggle();
  
  var subDialog = $( "#dialog-subReport" ).dialog({
    dialogClass: "no-close",
    modal: true,
    autoOpen: false,
    width: 900,
    buttons: {
      Close: function() {
        $( this ).dialog( "close" );
      }
    }
  });  

  $('.browseItemAmount').each(function(i, obj) {
    var value = $(obj).html();
    $(obj).html(formatAmountNumber(value, 'currency'));
  });
  
  applyTableSorter();
}

/* Set All Disbursement Defaults */
function setAllDisbursementDefaults(){
  log("Method: setAllDisbursementDefaults");
  verifyViewVersion();
  
  var action = $(field_Action).val();
  
  /* Set Defaults */
  disbursementForm = true; /* Used to indicate that this is a Disbursement form */
  loanProposalForm = false; /* Used to indicate that this is a Loan form */
  expenseRequisitionForm = false; /* Used to indicate this is a Requisition Form */
  iccApprovalAppForm = false; /* Used to indicate this is a ICC Approval APP Form */

  formatAmount(field_Amount, "currency", true);
  
  // Set all checkboxes to be checked from companion hidden elements
  loopCheck("load");

  $("#Field_Office_Div input.valueEditable").prop('readonly', true);
  loadBPSelectionList();
  
  setDefaultChecklists("checklist");
  setDefaultChecklists("additional_checklist");
  setDefaultDisbursementSignatures();
  
  if(!$("#_1_1_84_1_checkbox").is(':checked') && action != "FieldOffice" ){ 
    hideSignatureItem("_1_1_84_1");
  } // Field Officer

  /* Workspace Browser Setup */
  initRefreshButton();
  reloadDocumentList();
  //configcookie();
  setWorkSpaceCookie();
  setWorkSpaceExpanderGraphic();

  setDisplayComments(field_Comments, field_Comments + "_Display", field_Comments + "_Print");
  validateImportantComment();
}

/* Set All Loan Proposal Defaults */
function setAllProposalDefaults(){
  log("Method: setAllProposalDefaults");
  verifyViewVersion();
  
  /* Set Defaults */
  disbursementForm = false; /* Used to indicate that this is a Disbursement form */
  loanProposalForm = true; /* Used to indicate that this is a Loan form */
  expenseRequisitionForm = false; /* Used to indicate this is a Requisition Form */
  iccApprovalAppForm = false; /* Used to indicate this is a ICC Approval APP Form */

  formatAmount(field_Total_Exposure, "currency", true);
  formatAmount(field_Group_Exposure, "currency", true);
  
  // Set all checkboxes to be checked from companion hidden elements
  loopCheck("load");

  $("#Field_Office_Div input.valueEditable").prop('readonly', true);
  loadBPSelectionList();

  setDefaultChecklists("checklist");
  setDefaultProposalSignatures();

  initLoanWidget();
  
  /* Workspace Browser Setup */
  initRefreshButton();
  reloadDocumentList();
  //configcookie();
  setWorkSpaceCookie();
  
  setDisplayComments(field_Comments, field_Comments + "_Display", field_Comments + "_Print");
  setDisplayComments(field_Denials, field_Denials + "_Display", field_Denials + "_Print");
  validateImportantComment();

  if (hasSendToReferral()) {$('#ReturnButton').show();}
}

/* Set All Expense Requisition Defaults */
function setAllRequisitionDefaults(){
  log("Method: setAllRequisitionDefaults");
  verifyViewVersion();
  
  /* Set Defaults */
  disbursementForm = false; /* Used to indicate that this is a Disbursement form */
  loanProposalForm = false; /* Used to indicate that this is a Loan form */
  expenseRequisitionForm = true; /* Used to indicate this is a Requisition Form */
  iccApprovalAppForm = false; /* Used to indicate this is a ICC Approval APP Form */

  // Set all checkboxes to be checked from companion hidden elements
  loopCheck("load");

  //setDefaultChecklists("checklist");
  setDefaultRequestSignatures();

  setDisplayComments(field_Comments, field_Comments + "_Display", field_Comments + "_Print");
  setDisplayComments(field_Denials, field_Denials + "_Display", field_Denials + "_Print");
  initLineItemWidget();
  
  setRequestor();
}

/* Set All Expense Requisition Defaults */
function setAllICCApprovalDefaults(){
  log("Method: setAllICCApprovalDefaults");
  verifyViewVersion();
  
  /* Set Defaults */
  disbursementForm = false; /* Used to indicate that this is a Disbursement form */
  loanProposalForm = false; /* Used to indicate that this is a Loan form */
  expenseRequisitionForm = false; /* Used to indicate this is a Requisition Form */
  iccApprovalAppForm = true; /* Used to indicate this is a ICC Approval APP Form */

  // Set all checkboxes to be checked from companion hidden elements
  loopCheck("load");

  //setDefaultChecklists("checklist");
  setDefaultRequestSignatures();
	enableSignatureItem("iccSignor_checkbox", "iccSignor", "iccSignorName");
}

// Requestor
function setRequestor(){
  log("Method: setRequestor");

  if (!$(field_Requestor + "_Name").val()) {
    $(field_Requestor + "_ID").val($("#_1_1_27_1_ID").val());
    $(field_Requestor + "_SavedName").val($("#_1_1_27_1_SavedName").val());
    $(field_Requestor + "_Name").val($("#_1_1_27_1_Name").val());
    setEmployeeInformation($(field_Requestor + "_ID").val(), field_Manager, field_Requestor_Department, field_Requestor, 'Not Specified');  
  }
}

// Manager
function setManager(managerID, managerName){
  log("Method: setManager");

  if (!$(field_Manager + "_Name").val()) {
    $(field_Manager + "_ID").val(managerID);
    $(field_Manager + "_SavedName").val(managerName);
    $(field_Manager + "_Name").val(managerName);
    setEmployeeInformation($(field_Manager + "_ID").val(), null, field_Manager_Department, field_Requestor, 'Not Specified');  
  }
}
/**************************************************************************************************************/
/**************************************************************************************************************/
                                          /* END Defaults Section */
/**************************************************************************************************************/
/**************************************************************************************************************/


/**************************************************************************************************************/
/**************************************************************************************************************/
                                          /* Checkbox and Signature Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/

// Checklist_Section
function setDefaultChecklists(item){
  log("Method: setDefaultChecklists");
  var sectionHeader = "Checklist_Section";
  switch( item ) {
    case "checklist":
      sectionHeader = "Checklist_Section";
      disableCheckboxes("checklist");
      break
    case "additional_checklist":
      sectionHeader = "Additional_Checklist_Section";
      disableCheckboxes("additional_checklist");
      break

    default:
      // incorrect item
      break;
  }
}

function disableCheckboxes( item ){
  log("Method: disableCheckboxes: "+ item);

  var myItem = toLower(item);

  switch( item ) {
    case "checklist":
      $("#Checklist_Section .valueEditable").attr("disabled", true);
      break;

    case "additional_checklist":
        $("#Additional_Checklist_Section .valueEditable").attr("disabled", true);
        break;

    case "signature":
      $("#Signature_Section .valueEditable").attr("disabled", true);
      break

    case "post_approval_signature":
      $("#Post_Approval_Signature_Section .valueEditable").attr("disabled", true);
      break

    case "recommendation_signature":
      $("#Recommendation_Signature_Section .valueEditable").attr("disabled", true);
      break

    case "approval_signature":
      $("#Approval_Signature_Section .valueEditable").attr("disabled", true);
      break

    case "final_signature":
      $("#Final_Signature_Section .valueEditable").attr("disabled", true);
      break

    case "collect_signature":
      $("#Collect_Final_Signature_Section .valueEditable").attr("disabled", true);
      break

    default:
      // incorrect item
      break;
  }
}

function enableCheckboxes( item ){
  log("Method: enableCheckboxes: "+ item);

  var myItem = toLower(item);

  switch( item ) {
    case "checklist":
      $("#Checklist_Section .valueEditable").attr("disabled", false);
      break;

    case "additional_checklist":
      $("#Additional_Checklist_Section .valueEditable").attr("disabled", false);
      break;

    case "signature":
      $("#Signature_Section .valueEditable").attr("disabled", false);
      break

    case "post_approval_signature":
      $("#Post_Approval_Signature_Section .valueEditable").attr("disabled", false);
      break

    case "recommendation_signature":
      $("#Recommendation_Signature_Section .valueEditable").attr("disabled", false);
      break

    case "approval_signature":
      $("#Approval_Signature_Section .valueEditable").attr("disabled", false);
      break

    case "final_signature":
      $("#Final_Signature_Section .valueEditable").attr("disabled", false);
      break

    case "collect_signature":
      $("#Collect_Final_Signature_Section .valueEditable").attr("disabled", false);
      break

    default:
      // incorrect item
      break;
  }
}

function disableChecklistItem( item ){
  log("Method: disableChecklistItem: " + item);
  
  $("#"+item+"_checkbox").prop('disabled', true);

}

/* If the a specific actions is being performed or additional checklist item is checked, then show it's fields. */
function showAdditionalDisbursementChecklist( action ) {
  if (action == "Waiver") {
     $('#Additional_Checklist_Section').show();
    $("#_1_1_47_1_Div").show();
    enableAdditionalChecklistItem("_1_1_47_1");
  }
  else if (action == "Legal") {
     $('#Additional_Checklist_Section').show();
    $("#_1_1_48_1_Div").show();
    enableAdditionalChecklistItem("_1_1_48_1");
  }
  else if (action == "Transfer") {
     $('#Additional_Checklist_Section').show();
    $("#_1_1_53_1_Div").show();
    enableAdditionalChecklistItem("_1_1_53_1");
  }

  if (isCheckedById("_1_1_47_1_checkbox")) {
    $('#Additional_Checklist_Section').show();
    $("#_1_1_47_1_Div").show();
  }
  if (isCheckedById("_1_1_48_1_checkbox")) {
    $('#Additional_Checklist_Section').show();
    $("#_1_1_48_1_Div").show();
  }
  if (isCheckedById("_1_1_53_1_checkbox")) {
    $('#Additional_Checklist_Section').show();
    $("#_1_1_53_1_Div").show();
  }
}

/* If the a specific actions is being performed or additional checklist item is checked, then show it's fields. */
function showAdditionalProposalChecklist( action ) {
  if (action == "Legal") {
    $('#Additional_Checklist_Section').show();
    $("#Legal_Div").show();
    enableAdditionalChecklistItem("_1_1_71_1");
  }

  if (isCheckedById("_1_1_71_1_checkbox")) {
    $('#Additional_Checklist_Section').show();
    $("#Legal_Div").show();
  }
}

function enableAdditionalChecklistItem( item ){
  log("Method: enableAdditionalChecklistItem: " + item);

  $("#"+item+"_Div").show();
  $("#"+item+"_Div").find(':input').prop('disabled', false);

}

/* Loops through and enables all input fields within the checklist sections so that they will save back to the database on post */
function enableChecklistForSave() {
  $('#Checklist_Section').find(':input').prop('disabled', false);
  $('#Additional_Checklist_Section').find(':input').prop('disabled', false);
}

function setDefaultDisbursementSignatures(){
  log("Method: setDefaultDisbursementSignatures");

  /* disable all checklist checkboxes */
  disableCheckboxes("signature");
  disableCheckboxes("post_approval_signature");

  // TODO I think that the following is unnecessary because isChecked() already does this..
  $('#Signature_Section input:checkbox').each(function(i, obj) {
    var objVal = obj.value;

    if (objVal.indexOf('[LL_FormTag') == -1 && objVal != "" ) {
      $(obj).prop('checked', true);
      $('#'+obj.id+'_Div').show();
    }
  });

  // TODO I think that the following is unnecessary because isChecked() already does this..
  $('#Post_Approval_Signature_Section input:checkbox').each(function(i, obj) {
    var objVal = obj.value;

    if (objVal.indexOf('[LL_FormTag') == -1 && objVal != "" ) {
      $(obj).prop('checked', true);
      $('#'+obj.id+'_Div').show();
    }
  });

}

function setDefaultProposalSignatures(){
  log("Method: setDefaultProposalSignatures");

  /* disable all checklist checkboxes */
  disableCheckboxes("signature");
  disableCheckboxes("recommendation_signature");
  disableCheckboxes("approval_signature");
  disableCheckboxes("final_signature");
  disableCheckboxes("collect_signature");

}

/* Disable the checkboxes for signatures, check those that are checked, and set signatures to display */
function setDefaultRequestSignatures(){
  log("Method: setDefaultRequestSignatures");

  /* disable all checklist checkboxes */
  disableCheckboxes("signature");

  $('#Signature_Section input:checkbox').each(function(i, obj) {
    var objVal = obj.value;

    if (objVal.indexOf('[LL_FormTag') == -1 && objVal != "" ) {
      $(obj).prop('checked', true);
      $('#'+obj.id+'_Div').show();
    }
  });
}

function hideSignatureItem( item ){
  $('#'+item+'_Div').hide();
  $('#'+item+'_UserDiv').hide();
  $('#'+item+'_TimeDiv').hide();
}

/* Enable a set of items to be connected as a Signature and react when checked */
function enableSignatureItem( itemID1, itemID2, itemID3 ){
  $("#"+itemID1).prop('disabled', false);

  clearID(itemID2);
  $('#' + itemID3).val("");
  $("#"+itemID1).prop('checked', false);

  $("#"+itemID1).change(function() {

    if($("#"+itemID1).is(':checked')){
      populateID(itemID2);
      $('#' + itemID3).val(getDateTime());
    }  else {
      clearID(itemID2);
      $('#' + itemID3).val("");
    }
  });
  if (loanProposalForm && hasSendToReferral()) {
    $('#ReturnButton').hide();
    clearSendToReferral();
  }
}

/* Manually set a signature item as signed. */
function manuallySignItem( itemID1, itemID2, itemID3 ){
  $("#"+itemID1).prop('checked', true);
  populateID(itemID2);
  $('#' + itemID3).val(getDateTime());
}

function enableLastDisbursementCheckbox() {
  
}

/* Loops through and enables all input fields within the signature sections so that they will save back to the database on post */
function enableSignaturesForSave() {
  $('#Signature_Section').find(':input').prop('disabled', false);
  $('#Post_Approval_Signature_Section').find(':input').prop('disabled', false);
}

/* Loops through and enables all input fields within the signature sections so that they will save back to the database on post */
function enableProposalForSave() {
  $('#Signature_Section').find(':input').prop('disabled', false);
  $('#Recommendation_Signature_Section').find(':input').prop('disabled', false);
  $('#Approval_Signature_Section').find(':input').prop('disabled', false);
  $('#Final_Signature_Section').find(':input').prop('disabled', false);
  $('#Collect_Final_Signature_Section').find(':input').prop('disabled', false);
}

/* Loops through and enables all input fields within the signature sections so that they will save back to the database on post */
function enableRequisitionForSave() {
  if (formStatusTag == "Expense Requisition Initiation") {
    $('#Requestor_Section').find(':input').prop('disabled', false);
    $('#Loan_Section').find(':input').prop('disabled', false);
    $('#Totals_Section').find(':input').prop('disabled', false);
    $('#Signature_Section').find(':input').prop('disabled', false);
  }
  else {
    $('#Requestor_Section').find(':input').prop('disabled', true);
    $('#Loan_Section').find(':input').prop('disabled', true);
    $('#Totals_Section').find(':input').prop('disabled', true);
    $('#Signature_Section').find(':input').prop('disabled', false);
  }
}

function enableSendTo(){
  if (disbursementForm) {
    if(!$("#_1_1_84_1_checkbox").is(':checked')){ 
      $("#sendToFieldOffice").hide();
      hideSignatureItem("_1_1_84_1");
      //$("#sendToPrior").hide();
    } // Field Officer
  
    if((activeFormStep == "Operations") && !$("#_1_1_84_1_checkbox").is(':checked')){ 
      $("#sendToPrior").hide();
    }
  }
  else if (loanProposalForm) {
    if(activeFormStep == "CreateProposal") { 
      $("#sendToStepOperations").show();
      $("#sendToStepAMLAssistance").show();
    }
    else if(activeFormStep == "Propose") { 
      $("#sendToStepOperations").show();
      $("#sendToStepCreateProposal").show();
    }
    else if(activeFormStep == "VPConsideration") { 
      $("#sendToStepOperations").show();
      $("#sendToStepProposal").show();
    }
    else if(activeFormStep == "CEOConsideration") { 
      $("#sendToStepVPConsideration").show();
      $("#sendToStepRVPandFieldOffice").show();
      $("#sendToStepOperations").show();
    }
    else if(activeFormStep == "CreditRecommendation") { 
      $("#sendToStepRVPLoanReview").show();
      $("#sendToStepRVPandFieldOffice").show();
      $("#sendToStepLegalLoanReview").show();
    }
    else if(activeFormStep == "AMLRecommendation") { 
      $("#sendToStepFieldOfficeCorrection").show();
      $("#sendToStepRVPandFieldOffice").show();
      $("#sendToStepLegalLoanReview").show();
      $("#sendToStepSeniorAMLRecommendation").show();
    }
    else if(activeFormStep == "SeniorAMLRecommendation") { 
      $("#sendToStepFieldOfficeCorrection").show();
      $("#sendToStepRVPandFieldOffice").show();
      $("#sendToStepLegalLoanReview").show();
    }
    else if(activeFormStep == "SEMSRecommendation") { 
      $("#sendToStepFieldOfficeCorrection").show();
      $("#sendToStepRVPandFieldOffice").show();
      $("#sendToStepLegalLoanReview").show();
    }
    else if(activeFormStep == "RVPLoanReview") { 
      $("#sendToStepFieldOfficeCorrection").show();
      $("#sendToStepOperations").show();
    }
    else if(activeFormStep == "FieldOfficeCorrection") { 
      $("#sendToStepOperations").show();
    }
    else if(activeFormStep == "CEOOverride") { 
      $("#sendToStepRVPLoanReview").show();
    }
    else if(activeFormStep == "RVPApproval") { 
      $("#sendToStepCreditReview").show();
    }
    else if(activeFormStep == "CollectRemainingDocuments") { 
      $("#sendToStepOperations").show();
    }
  }
  
  $('#SendToButton').show();
  $('#SendToButton_input').prop('disabled', true);

  $('#SendTo_Select_Div').show();

  $("#SendTo_Select").change(function() {
    log("enableSendTo  value " + $(this).val());
    if($(this).val() != ""){
      $('#SendToButton_input').prop('disabled', false);
    }  else {
      $('#SendToButton_input').prop('disabled', true);
    }
  });
}

/*hide the send to step options*/
function hideSendToStepOptions() {
  $( "option[id^='sendToStep']" ).hide();
}

/*show the send to step options*/
function showSendToStepOptions() {
  $( "option[id^='sendToStep']" ).show();
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                                          /* Checkbox and Siganture Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/


/**************************************************************************************************************/
/**************************************************************************************************************/
                                          /* HELPER Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/
/* Log information to the console with a datetime. */
function log(m, a){
  // if a = true alert - else console.log
  if (LAAD_DEBUG) {
    m += getActionDateTime();
    (a) ? alert(m) : console.log(m) ;
  }
}

function toLower(s){
  var myString = (typeof s === 'string') ? s : s.toString()  ;
      myString.toLowerCase();
      return myString;
}

function addNumbersRounded(a1, a2) {
    var adder1 = 0;
    var adder2 = 0;
    if (a1) {adder1 = a1;}
    if (a2) {adder2 = a2;}
    var result = parseFloat(adder1) + parseFloat(adder2);
    return result.toFixed(2);
}

function requiredField(divName, field){
  $(divName + ' span.required').show();
  $(field).addClass("required");
  return false;
}

function notRequiredField(divName, field){
  $(divName + ' span.required').hide();
  $(field).removeClass("required");
  return false;
}

function isCheckedById(id) {
  var checked = $('#' + id).is(":checked")
  if (checked == 0) {
    return false;
  } else {
    return true;
  }
}

/* called after load to convert all subreport dates to local time */
function convertTableDate() {
  $('.dateCell').each(function() {
    var cell = $(this).html();
    $(this).html(formatTheActionDate(cell));
  });
}

/* called after load to convert all subreport dates to local time */
function formatTheActionDate(actionDate) {
  var localDate = "";
  if(actionDate != "" && actionDate != "?"){
    if (actionDate.indexOf('GMT') == -1) {
      actionDate += ' GMT-0400';
    }
    actionDate = actionDate.replace("GMT", "UTC");
    var d = new Date(actionDate);
    localDate = d.toLocaleString();
  }
  return localDate;
}

/* called after load to convert all subreport dates to local time */
function formatTheActionDateAsParameter(actionDate) {
  var parameterDate = formatTheActionDate(actionDate);
  if (parameterDate) {
    var dateObject = new Date(parameterDate);
    var parameterDate = dateObject.getFullYear() + ("0"+(dateObject.getMonth()+1)).slice(-2) + ("0" + dateObject.getDate()).slice(-2);
  }
  return parameterDate;
}

/* called by doSubmit to store the Check Box Values */
function loopCheck(loopAction) {
  log("Method: loopCheck: " + loopAction);

  //if loopAction = load call isChecked()
  //if loopAction = Store call saveChecked()
  (loopAction == "load") ? isChecked() : saveChecked() ;
}

/* determines the state of a checkbox from it's text persistence */ 
function isChecked() {
  log("Method: isChecked: ");

  //field = find by name
  //checkbox = find by name+"_checkbox"

  $('input.noCheckDisplay').each(function(i, obj) {
    var objVal = obj.value;
    var objID = obj.id;

    //if field is not blank or 0 - set checkbox to checked
    if (objVal == "1" || objVal == "true") {
      $("#"+objID+"_checkbox").prop('checked', true);
    }
  });
}

/* For a checkbox field name, store the state of the checkbox to the corresponding input field */
function saveChecked() {
  log("Method: saveChecked: ");

  //field = find by name
  //checkbox = find by name+"_checkbox"

  $('input.noCheckDisplay').each(function(i, obj) {
    var objVal = obj.value;
    var objID = obj.id;

    var checkField = objID+"_checkbox";

    //if checkbox is checked - set field value to 1
    //TODO This will not save elements that are true OpenText Form Checkboxes.
   ($("#"+checkField).prop("checked")) ? $("#"+objID).val("1") : $("#"+objID).val("") ;
  });
}

/* color changer (stylesheet) */
//$(document).ready(function (){
function initColorChanger(){
  log("initColorChanger: " );
  log("appSupportPath: " + appSupportPath );

  $("#moreColors a").click(function() {
    $("#extraColors").toggle("slow", function(){
      var displayText = $("#moreColors a").html();
      var newText = (displayText == "More") ? "Less" : "More" ;
      $("#moreColors a").text(newText);
    });
  });

  if($.cookie("cssColorSwitch")) {
    log("CSS Cookie: Is set to: " + $.cookie("cssColorSwitch"));
    $("link.colorSwitch").attr("href",$.cookie("cssColorSwitch"));
  }
  else {
    $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/default-orange.css");
    $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/default-orange.css", {expires: 365});
  }

  // Apply some CSS3 to keep the CSS file CSS 2.1 valid
  $("h4").css("text-shadow", "0px 2px 6px #000");
  $("h5 a").css("text-shadow", "0px 2px 6px #000");

  // Color changer
  $(".defaultOrange").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/default-orange.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/default-orange.css", {expires: 365});
      return false;
  });

  $(".oliveGreen").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/olive-green.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/olive-green.css", {expires: 365});
      return false;
  });

  $(".limeGreen").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/lime-green.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/lime-green.css", {expires: 365});
      return false;
  });

  $(".lightGrey").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/light-grey.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/light-grey.css", {expires: 365});
      return false;
  });

  $(".aquaGrey").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/aqua-grey.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/aqua-grey.css", {expires: 365});
      return false;
  });

  $(".appleGreen").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/apple-green.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/apple-green.css", {expires: 365});
      return false;
  });

  $(".grassGreen").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/grass-green.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/grass-green.css", {expires: 365});
      return false;
  });

  $(".lightBrown").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/light-brown.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/light-brown.css", {expires: 365});
      return false;
  });

  $(".oceanBlue").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/ocean-blue.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/ocean-blue.css", {expires: 365});
      return false;
  });

  $(".skyBlue").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/sky-blue.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/sky-blue.css", {expires: 365});
      return false;
  });

  $(".neonGreen").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/neon-green.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/neon-green.css", {expires: 365});
      return false;
  });

  $(".neonYellow").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/neon-yellow.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/neon-yellow.css", {expires: 365});
      return false;
  });

  $(".brightOrange").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/bright-orange.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/bright-orange.css", {expires: 365});
      return false;
  });

  $(".rose").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/rose.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/rose.css", {expires: 365});
      return false;
  });

  $(".deepPink").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/deep-pink.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/deep-pink.css", {expires: 365});
      return false;
  });

  $(".deepMagenta").click(function(){
      $("link.colorSwitch").attr("href", appSupportPath+"LAAD/css/deep-magenta.css");
      $.cookie("cssColorSwitch",appSupportPath+"LAAD/css/deep-magenta.css", {expires: 365});
      return false;
  });

  $('a').each(function(){
    $(this).prop("tabindex","-1");
  });
}
//});

function getActionDateTime(){
  var d = new Date();
  var u = d.toUTCString();
  return u;
}

function getDateTime(){
  var d = new Date,
      dformat = [ (d.getMonth()+1).padLeft(),
                  d.getDate().padLeft(),
                  d.getFullYear()].join('/')+
                  ' ' +
                [ d.getHours().padLeft(),
                  d.getMinutes().padLeft(),
                  d.getSeconds().padLeft()].join(':');
  return dformat;
}

Number.prototype.padLeft = function(base,chr){
     var  len = (String(base || 10).length - String(this).length)+1;
     return len > 0? new Array(len).join(chr || '0')+this : this;
  }

 function getStepNumber( step ){
   switch(step) {
    case "FieldOffice":
        return 1
        break;
    case "Operations":
        return 2
        break;
    case "Compliance":
        return 3
        break;
    case "LoanOfficer":
        return 4
        break;
    case "Accounting":
        return 5
        break;
    case "MgmtI":
        return 6
        break;
    case "MgmtII":
        return 7
        break;
    default:
        return 0
  }
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                                          /* HELPER Methods END  */
/**************************************************************************************************************/
/**************************************************************************************************************/


/**************************************************************************************************************/
/**************************************************************************************************************/
                                /* Loan Disburse List */
/**************************************************************************************************************/
/**************************************************************************************************************/

/* Calls a web report to make the selected loan completed for disbursement. */
function setLoanAsFullyDisbursed() {
}

function filterLoanListByFieldOffice(selectedFieldOffice) {
  var counter = 0;
  var defaultSelector = 0;
  var regex = new RegExp(selectedFieldOffice+"$");
  $("#Loan_Proposal option").each(function() {
    if ($(this).text() == "<Select One>" || $(this).text() == "<No Loans Listed>") {
      $(this).attr('selected','selected');
      defaultSelector = this;
    }
    else if ($(this).val().match(regex) || selectedFieldOffice == "<Select One>") {
      var node = $(this);
      if ($(this).parent().is("span")) {
        node.unwrap();
      }
      counter++;
    }
    else {
      if ($(this).parent().is("span")) {
      }
      else {
        $(this).wrap('<span/>');
      }
    }
  });
  
  if (counter == 0) {
    $(defaultSelector).text("<No Loans Listed>");
  }
  else {
    $(defaultSelector).text("<Select One>");
  }
}

function loanDisburseSelected() {
  var selectedLoanProposal = $('#Loan_Proposal').find(":selected").val();
  if(selectedLoanProposal && selectedLoanProposal != "none") {
    var selectedLoanValues = selectedLoanProposal.split(",");
    $(field_Field_Office).val(selectedLoanValues[5]);
    $(field_Loan_Type).val(selectedLoanValues[3]);
    fieldOfficeSelected();
  }
}


function makeItLoanType() {
  $('#Loan_Type_Div').show();
  $(field_Loan_Type).attr("disabled", false);
  requiredField('#Loan_Type_Div', field_Loan_Type);
  
  $('#Loan_Proposal_Div').hide();
  $('#Last_Disbursement').show();
  $('#Loan_Proposal').attr("disabled", true);
  notRequiredField('#Loan_Proposal_Div', '#Loan_Proposal');

  $('#BP_Selector').attr("disabled", false);
  requiredField('#BP_Name_Div', field_BP_Name);
}

function makeItLoanProposal() {
  $('#Loan_Type_Div').hide();
  $(field_Loan_Type).attr("disabled", true);
  notRequiredField('#Loan_Type_Div', field_Loan_Type);
  
  $('#Loan_Proposal_Div').show();
  $('#Loan_Proposal').attr("disabled", false);
  requiredField('#Loan_Proposal_Div', '#Loan_Proposal');

  $('#BP_Selector').attr("disabled", true);
  notRequiredField('#BP_Name_Div', field_BP_Name);
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                                /* END Loan Disburse List */
/**************************************************************************************************************/
/**************************************************************************************************************/

/**************************************************************************************************************/
/**************************************************************************************************************/
                                /* Disbursement View INIT Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/

/* Print View */
function initPrintView(){
  log("Method: initPrintView");
  //hide the tree structure accordion
  $("#accordion").hide();
  
  //hide the coments edit and display (localized version) for print
  $(field_Comments + '_NewComment').hide();
  $(field_Comments + '_Display').hide();

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");
  showAdditionalDisbursementChecklist("Waiver");
  showAdditionalDisbursementChecklist("Legal");
  showAdditionalDisbursementChecklist("Transfer");

  enableCheckboxes("checklist");

  /* Attachments Section */
  $('#BPBW_Div').show();
  checkBPBWpathBtns();

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Post_Approval_Signature_Section').show();

  //makePrintReady();

  $('#SubmitButton').hide();

  //$("input").attr('disabled', 'disabled'); //disable
  $('input').prop("disabled", true); //disable

  $('#PrintViewButtons input').prop("disabled", false);
  
  /* TODO These next items don't work.  Get Brian to fix and test them properly */
  $("#PrintViewEditButton").hide();
  $("#PrintViewCancelButton").hide();
  $("#PrintViewSubmitButton").hide();
  if(userIsPrintViewIT == "TRUE"){ 
    $("#PrintViewEditButton").show();
  }
  //$("#PrintViewSubmitButton").hide();
  //$("#PrintButton input").attr('disabled', 'enabled'); //enabled
}

/* initialize status methods */
function initInitiateDisbursement(){
  log("Method: initInitiateDisbursement");
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */
  
  /* Header Fields */
	$('#BP_Number_Div').hide();
	$(field_BP_Number).removeClass("required");

  $('#Loan_Number_Div').hide();
  $(field_Loan_Number).removeClass("required");

  $(field_Field_Office).attr("disabled", false);

  $('#Last_Disbursement').show();
  $("#Loan_Type_Label").click(function(){ makeItLoanProposal(); });
  $("#Loan_Proposal_Label").click(function(){ makeItLoanType(); });
  $("#Loan_Type_Label").addClass('switchableLabel');
  $("#Loan_Proposal_Label").addClass('switchableLabel');
  makeItLoanType();

  $('#Signature_Section').hide();

  $('#Comment_Section').hide();
}

function initFieldOfficeDocumentReview(){
  log("Method: initFieldOfficeDocumentReview");
  activeFormStep = "FieldOffice";

  /* Header Fields */
	$('#BP_Number_Div').hide();
	$('#BP_Number_Div span.required').hide();
	$(field_BP_Number).removeClass('required');

  $('#Loan_Number_Div').hide();
  $('#Loan_Number_Div span.required').hide();
  $(field_Loan_Number).removeClass('required');  

  $(field_Loan_Type).attr("disabled", true);

  $('#BP_Selector').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  enableCheckboxes("checklist");
  
  disableChecklistItem("_1_1_10_1"); // Approved Loan Checkbox
  disableChecklistItem("_1_1_11_1"); // VP Approval Checkbox
  disableChecklistItem("_1_1_81_1"); // Exposure Checkbox

  /* Attachments Section */

  /* Signatures Fields */
  $('#Signature_Section').show();

  enableSignatureItem("_1_1_84_1_checkbox", "_1_1_85_1", "_1_1_86_1");

  /* Buttons */

}

/* DEPRECATED: The First Step :DEPRECATED */
function initOperationsCompletesDisbursement(){
	log("Method: initOperationsCompletesDisbursement");
  
  activeFormStep = "Operations";

	/* Header Fields */
	$('#BP_Number_Div span.required').hide();
	$(field_BP_Number).removeClass('required');

  $('#Loan_Number_Div span.required').hide();
  $(field_Loan_Number).removeClass('required');  

  $(field_Loan_Type).attr("disabled", true);

  $('#BP_Selector').attr("disabled", true);

	/* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

	enableCheckboxes("checklist");

	/* Attachments Section */
	$('#BPBW_Div').show();
	checkBPBWpathBtns();

	/* Signatures Fields */
  $('#Signature_Section').show();

	enableSignatureItem("_1_1_26_1_checkbox", "_1_1_28_1", "_1_1_58_1");

  /* Buttons */
  $('#TerminateButton').show();
	enableSendTo();
}

/* The First Step */
function initOperationsDisbursementReview(){
	log("Method: initOperationsDisbursementReview");
  
  activeFormStep = "Operations";

	/* Header Fields */
	$('#BP_Number_Div span.required').hide();
	$(field_BP_Number).removeClass('required');

  $('#Loan_Number_Div span.required').hide();
  $(field_Loan_Number).removeClass('required');  

  $(field_Loan_Type).attr("disabled", true);

  $('#BP_Selector').attr("disabled", true);

	/* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

	enableCheckboxes("checklist");

	/* Attachments Section */
	$('#BPBW_Div').show();
	checkBPBWpathBtns();

	/* Signatures Fields */
  $('#Signature_Section').show();

	enableSignatureItem("_1_1_26_1_checkbox", "_1_1_28_1", "_1_1_58_1");

  /* Buttons */
  $('#TerminateButton').show();
	enableSendTo();
}

/* The Second Step */
function initComplianceReview(){
  log("Method: initComplianceReview");
  activeFormStep = "Compliance";

  /* Header Fields */
	$('#BP_Number_Div span.required').hide();
	$(field_BP_Number).removeClass('required');

  $('#Loan_Number_Div span.required').hide();
  $(field_Loan_Number).removeClass('required');  

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  enableCheckboxes("checklist");

  /* Signatures Fields */
  $('#Signature_Section').show();

  enableSignatureItem("_1_1_55_1_checkbox", "_1_1_56_1", "_1_1_59_1");

  /* Buttons */
  $('#WaiverButton').show();
  $('#HoldButton').show();
  $('#LegalButton').show();
  enableSendTo();
}

/* The Third Step */
function initLoanOfficerReview(){
  log("Method: initLoanOfficerReview");
  activeFormStep = "LoanOfficer";

  /* Header Fields */
	$('#Field_Office_Div span.required').hide();

  $(field_Loan_Type).attr("disabled", true);

  $('#BP_Selector').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $("#_1_1_81_1_checkbox").attr("disabled", false);
  showAdditionalDisbursementChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();

  enableSignatureItem("_1_1_29_1_checkbox", "_1_1_30_1", "_1_1_60_1");

  /* Buttons */
  $('#WaiverButton').show();
  $('#HoldButton').show();
  $('#LegalButton').show();
  enableSendTo();
}

/* The Fourth Step */
function initAccountingReview(){
  log("Method: initAccountingReview");
  activeFormStep = "Accounting";

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();

  enableSignatureItem("_1_1_31_1_checkbox", "_1_1_32_1", "_1_1_61_1");

  /* Buttons */
  $('#WaiverButton').show();
  $('#HoldButton').show();
  $('#LegalButton').show();
  enableSendTo();
}

/* The Fifth Step */
function initManagementIReview(){
  log("Method: initManagementIReview");
  activeFormStep = "MgmtI";

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();

  enableSignatureItem("_1_1_33_1_checkbox", "_1_1_34_1", "_1_1_62_1");

  /* Buttons */
  $('#WaiverButton').show();
  $('#HoldButton').show();
  $('#LegalButton').show();
  enableSendTo();
}

/* The Sixth Step */
function initManagementIIReview(){
  log("Method: initManagementIIReview");
  activeFormStep = "MgmtII";

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();

  enableSignatureItem("_1_1_35_1_checkbox", "_1_1_36_1", "_1_1_63_1");

  /* Buttons */
  $('#WaiverButton').show();
  $('#HoldButton').show();
  $('#LegalButton').show();
  enableSendTo();
}

/* DEPRECATED: The Seventh Step (Post Approval) :DEPRECATED*/
function initLoanOfficerPostDisbursement(){
  log("Method: initLoanOfficerPostDisbursement");

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Post_Approval_Signature_Section').show();
  $('#Closing_Section').hide();

  enableSignatureItem("_1_1_37_1_checkbox", "_1_1_38_1", "_1_1_64_1");
  //$("#_1_1_70_1_checkbox").prop('disabled', false);
  $("#_1_1_37_1_CheckDiv").find(':input').prop('disabled', false);

  /* Buttons */
}

/* The Seventh Step (Post Approval)*/
function initLoanOfficerPostDisbursementandClosingFees(){
  log("Method: initLoanOfficerPostDisbursementandClosingFees");

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Post_Approval_Signature_Section').show();
  $('#Closing_Section').hide();

  enableSignatureItem("_1_1_37_1_checkbox", "_1_1_38_1", "_1_1_64_1");
  //$("#_1_1_70_1_checkbox").prop('disabled', false);
  $("#_1_1_37_1_CheckDiv").find(':input').prop('disabled', false);

  /* Buttons */
}

/* The Eighth Step (Post Approval)*/
function initAccountingCreatesClosingFee(){
  log("Method: initAccountingCreatesClosingFee");

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Post_Approval_Signature_Section').show();

  enableSignatureItem("_1_1_39_1_checkbox", "_1_1_40_1", "_1_1_65_1");

  /* Buttons */
}

/* The Ninth Step (Post Approval)*/
function initAccountingPostsClosingFee(){
  log("Method: initAccountingPostsClosingFee");

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Post_Approval_Signature_Section').show();

  enableSignatureItem("_1_1_45_1_checkbox", "_1_1_46_1", "_1_1_68_1");

  /* Buttons */
}

/* The Tenth Step (Post Approval)*/
function initAccountingPerformsPaymentRun(){
  log("Method: initAccountingPerformsPaymentRun");

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Post_Approval_Signature_Section').show();
  $('#Closing_Section').hide();

  enableSignatureItem("_1_1_41_1_checkbox", "_1_1_42_1", "_1_1_66_1");

  /* Buttons */
}

/* The Eleventh Step (Post Approval)*/
function initManagementIIReleasePaymentRun(){
  log("Method: initManagementIIReleasePaymentRun");

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Post_Approval_Signature_Section').show();
  $('#Closing_Section').hide();

  enableSignatureItem("_1_1_43_1_checkbox", "_1_1_44_1", "_1_1_67_1");

  /* Buttons */
}

/* The feature for parking an invoice with the RVP */
function initWaiver(){
  log("Method: initWaiver");

  /* Header Fields */
  $(field_Loan_Number).removeClass('required');

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("Waiver");

  /* Signatures Fields */
  $('#Signature_Section').show();

  enableSignatureItem("_1_1_47_1_checkbox", "_1_1_77_1", "_1_1_78_1");

  /* Buttons */
}

/* The feature for parking an invoice assigned to the parking uid */
function initHold(){
  log("Method: initHold");

  /* Header Fields */
  $(field_Loan_Number).removeClass('required');

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();

  /* Buttons */
}

/* The feature for parking the invoice with legal */
function initLegalReview(){
  log("Method: initLegalReview");

  /* Header Fields */
  $(field_Loan_Number).removeClass('required');

  /* Disable Header Section Display Only as Labels */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#selectFieldOfficeButton').attr("href", "javascript:void(0);");

  /* Checklist Fields */
  $('#Checklist_Section').show();
  showAdditionalDisbursementChecklist("Legal");

  enableSignatureItem("_1_1_48_1_checkbox", "_1_1_79_1", "_1_1_80_1");

  /* Signatures Fields */
  $('#Signature_Section').show();
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                                /* END Disbursement View INIT Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/

  
/**************************************************************************************************************/
/**************************************************************************************************************/
                            /* Expense Requisition Initiaization */
/**************************************************************************************************************/
/**************************************************************************************************************/

/* Enable editing of all fields */
function initExpenseRequisitionInitiation(){
  log("Method: initExpenseRequisitionInitiation");

  /* Header Fields */
  enableCheckboxes("checklist");

  /* List Items */
  $(document).on('click',".datepicker_recurring_start", function() {
    reinitDatepicker();
  }); 
  
  /* Signatures Fields */
  $('#Signature_Section').show();
  var lastSignature = 0;
  for (var i = 1; i <= 10; i++) {
    if ($("#_1_1_16_" + i + "_19_1").val()) {
      $("#Approval_" + i).show();
      lastSignature = i;
    }
    else {
      $("#Approval_" + i).hide(); //make sure that unchecked signatures are not showing
    }
  }
  lastSignature++;
  
  if (lastSignature <= 10) {
    $("#Approval_" + lastSignature).show();
    enableSignatureItem("_1_1_16_" + lastSignature + "_17_1_checkbox", "_1_1_16_" + lastSignature + "_18_1", "_1_1_16_" + lastSignature + "_19_1");
    $(field_Number_Of_Signatures).val(lastSignature);
  }
  
  /* Comments Section */
  $('#Deny_Section').hide();
}

/* Remove and readd the datepicker, because it is on a dynamic field */
function reinitDatepicker() {
  $(".hasDatepicker").removeClass("hasDatepicker");
  $(".datepicker_recurring_start").datepicker("destroy");
  $(".datepicker_recurring_start").datepicker();
}

/* Disable editing of fields except for Comments and the latest Signature level */
function initExpenseRequisitionApproval() {
  log("Method: initExpenseRequisitionApproval");

  /* Header Fields */
  disableCheckboxes("checklist");
  $('#Requestor_Section').find(':input').prop('disabled', true);
  $(field_Profit_Center).prop('disabled', false);
  $('#Loan_Section').find(':input').prop('disabled', true);
  $('#Totals_Section').find(':input').prop('disabled', true);

  /* List Items */
  $('#addLineItemRow').hide();
  $('.fa-minus-square').hide();

  /* Signatures Fields */
  $('#Signature_Section').show();
  var lastSignature = 0;
  for (var i = 1; i <= 10; i++) {
    if ($("#_1_1_16_" + i + "_19_1").val()) {
      $("#Approval_" + i).show();
      lastSignature = i;
    }
    else {
      $("#Approval_" + i).hide(); //make sure that unchecked signatures are not showing
    }
  }
  lastSignature++;
  
  if (lastSignature <= 10) {
    $("#Approval_" + lastSignature).show();
    enableSignatureItem("_1_1_16_" + lastSignature + "_17_1_checkbox", "_1_1_16_" + lastSignature + "_18_1", "_1_1_16_" + lastSignature + "_19_1");
    $(field_Number_Of_Signatures).val(lastSignature);
  }
  
  /* Comments Section */
  $('#DenyButton').show();
  if ($(field_Denied).val() == "1" || $(field_Denied).val() == "true") {
    $('#Deny_Section').show();
    $('#SubmitButton').hide();
  }
  else {
    $('#Deny_Section').hide();
  }
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                                /* END Expense Requisition View INIT Methods */
/**************************************************************************************************************/
/**************************************************************************************************************/

  
/**************************************************************************************************************/
/**************************************************************************************************************/
                            /* Loan Proposal Views Initiaization */
/**************************************************************************************************************/
/**************************************************************************************************************/

/* initialize status methods */
function initOperationsAssistance(){
  log("Method: initOperationsAssistance");
  /* Show and enable everything */

  activeFormStep = "Operations";

  /* Header Fields */

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", false);
  showAdditionalProposalChecklist("");

  enableCheckboxes("checklist");

  /* TODO Legacy Remove Attachments Section */
  $('#BPBW_Div').show();
  checkBPBWpathBtns();

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').show();
  $('#Final_Signature_Section').show();
  $('#Collect_Final_Signature_Section').show();

  /* Buttons */
  $('#DenyButton').show();
  enableSendTo();
}

/* Hide all fields and all buttons except for BP and Loan section and the Submit Button */
function initFirstContact(){
  log("Method: initFirstContact");

  /* Header Fields */
  $('#addLoanRow').show();
 
  $('#Comment_Section').hide();
  $('#Deny_Section').hide();
}

/* Show All header fields as editable, Checklist/Browser, Additional Checklist, Proposal signature section, Deny and Submit button, and SendTo Operations/Legal */
function initCreateProposal() {
  log("Method: initCreateProposal");

  activeFormStep = "CreateProposal";

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').show();
  
  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", false);
  showAdditionalProposalChecklist("");

  enableCheckboxes("checklist");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').hide();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();
  $('#CEOConsideration').show();

  enableSignatureItem("_1_1_62_1_checkbox", "_1_1_63_1", "_1_1_64_1");

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  hideSendToStepOptions();
  enableSendTo();
}

/* Show All header fields as editable, Checklist/Browser, Additional Checklist, Proposal signature section, Deny and Submit button, and SendTo Operations/Legal */
function initPropose(){
  log("Method: initPropose");
  activeFormStep = "Propose";

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').show();

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", false);
  showAdditionalProposalChecklist("");

  enableCheckboxes("checklist");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').hide();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();
  $('#CEOConsideration').show();

  enableSignatureItem("_1_1_65_1_checkbox", "_1_1_66_1", "_1_1_67_1");

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  hideSendToStepOptions();
  enableSendTo();
}

/* Show All header fields locked, Checklist/Browser, Checklist is read only, Additional Checklist, Proposal signature section, Deny and Submit button, and SendTo Operations/Legal */
function initVPConsideration(){
  log("Method: initVPConsideration");
  activeFormStep = "VPConsideration";

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').hide();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();
  $('#CEOConsideration').show();

  enableSignatureItem("_1_1_68_1_checkbox", "_1_1_69_1", "_1_1_70_1");

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  $('#DenialButton').val("Not Recommended");
  $('#Deny_This_Request').val("Submit");
  $('#DenialReason').text("Reason for Not Recommending");
  hideSendToStepOptions();
  enableSendTo();
}

/* Show All header fields locked, Checklist/Browser, Checklist is read only, Additional Checklist, Proposal signature section, Deny and Submit button, and SendTo Operations/Legal */
function initCEOConsideration(){
  log("Method: initCEOConsideration");
  activeFormStep = "CEOConsideration";

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').hide();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();
  $('#CEOConsideration').show();
 
  enableSignatureItem("_1_1_190_1_checkbox", "_1_1_191_1", "_1_1_192_1");

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  $('#DenialButton').val("Not Recommended");
  $('#Deny_This_Request').val("Submit");
  $('#DenialReason').text("Reason for Not Recommending");
  hideSendToStepOptions();
  enableSendTo();
}

/* Show All header fields locked, Checklist/Browser, Checklist is read only, Additional Checklist, Proposal signature section, Deny and Submit button, and SendTo Operations/Legal */
function initCreditRecommendation(){
  log("Method: initCreditRecommendation");
  activeFormStep = "CreditRecommendation";

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  enableSignatureItem("_1_1_80_1_checkbox", "_1_1_81_1", "_1_1_82_1");

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  $('#DenialButton').val("Not Recommended");
  $('#Deny_This_Request').val("Submit");
  $('#DenialReason').text("Reason for Not Recommending");
  hideSendToStepOptions();
  enableSendTo();

  /* Hide Signature Inputs */
  $('#CreditRecommendation').show();
  $('#AMLRecommendation').show();
  $('#SeniorAMLRecommendation').show();
  $('#SEMSRecommendation').show();
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* initialize status methods */
function initAMLRecommendation(){
  log("Method: initAMLRecommendation");
  activeFormStep = "AMLRecommendation";
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  enableSignatureItem("_1_1_213_1_checkbox", "_1_1_214_1", "_1_1_215_1");

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  $('#DenialButton').val("Not Recommended");
  $('#Deny_This_Request').val("Submit");
  $('#DenialReason').text("Reason for Not Recommending");
  hideSendToStepOptions();
  enableSendTo();

  /* Hide Signature Inputs */
  $('#CreditRecommendation').show();
  $('#AMLRecommendation').show();
  $('#SeniorAMLRecommendation').show();
  $('#SEMSRecommendation').show();
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* initialize status methods */
function initSeniorAMLRecommendation(){
  log("Method: initSeniorAMLRecommendation");
  activeFormStep = "SeniorAMLRecommendation";
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  enableSignatureItem("_1_1_178_1_checkbox", "_1_1_179_1", "_1_1_180_1");

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  $('#DenialButton').val("Not Recommended");
  $('#Deny_This_Request').val("Submit");
  $('#DenialReason').text("Reason for Not Recommending");
  hideSendToStepOptions();
  enableSendTo();

  /* Hide Signature Inputs */
  $('#CreditRecommendation').show();
  $('#AMLRecommendation').show();
  $('#SeniorAMLRecommendation').show();
  $('#SEMSRecommendation').show();
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* initialize status methods */
function initSEMSRecommendation(){
  log("Method: initSEMSRecommendation");
  activeFormStep = "SEMSRecommendation";
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  enableSignatureItem("_1_1_92_1_checkbox", "_1_1_93_1", "_1_1_94_1");

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  $('#DenialButton').val("Not Recommended");
  $('#Deny_This_Request').val("Submit");
  $('#DenialReason').text("Reason for Not Recommending");
  hideSendToStepOptions();
  enableSendTo();

  /* Hide Signature Inputs */
  $('#CreditRecommendation').show();
  $('#AMLRecommendation').show();
  $('#SeniorAMLRecommendation').show();
  $('#SEMSRecommendation').show();
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* initialize status methods */
function initCEOOverride(){
  log("Method: initCEOOverride");
  activeFormStep = "CEOOverride";

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  enableSignatureItem("_1_1_197_1_checkbox", "_1_1_198_1", "_1_1_199_1");

  /* Comments Section */
  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  $('#DenialButton').val("Not Recommended");
  $('#Deny_This_Request').val("Submit");
  $('#DenialReason').text("Reason for Not Recommending");
  hideSendToStepOptions();
  enableSendTo();

  /* Hide Signature Inputs */
  $('#CEOOverride').show();
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
}

/* Show All header fields locked, Checklist/Browser, Checklist is read only, Additional Checklist, Approval signature section, Deny and Submit button, and SendTo Operations/Legal */
function initRVPApproval(){
  log("Method: initRVPApproval");
  activeFormStep = "RVPApproval";

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').show();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  enableSignatureItem("_1_1_98_1_checkbox", "_1_1_99_1", "_1_1_100_1");
  
  /* Comments Section */
  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  $('#DenialButton').val("Not Recommended");
  $('#Deny_This_Request').val("Submit");
  $('#DenialReason').text("Reason for Not Recommending");
  hideSendToStepOptions();
  enableSendTo();

  /* Hide Signature Inputs */
  $('#RVP').show();
  $('#CEOCFO').hide();
  $('#CreditICC').hide();
  $('#CFOICC').hide();
  $('#vpLegalICC').hide();
  $('#CEOICC').hide();
  $('#vpRegion1').hide();
  $('#vpRegion2').hide();
  $('#vpRegion3').hide();
  $('#Board').hide();
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* Show All header fields locked, Checklist/Browser, Checklist is read only, Additional Checklist, Approval signature section, Deny and Submit button, and SendTo Operations/Legal */
function initCEOCFOApproval(){
  log("Method: initCEOCFOApproval");
  activeFormStep = "CEOCFOApproval";

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').show();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  enableSignatureItem("_1_1_104_1_checkbox", "_1_1_105_1", "_1_1_106_1");

  /* Comments Section */
  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  $('#DenialButton').val("Not Recommended");
  $('#Deny_This_Request').val("Submit");
  $('#DenialReason').text("Reason for Not Recommending");
  hideSendToStepOptions();
  enableSendTo();

  /* Hide Signature Inputs */
  $('#RVP').hide();
  $('#CEOCFO').show();
  $('#CreditICC').hide();
  $('#CFOICC').hide();
  $('#vpLegalICC').hide();
  $('#CEOICC').hide();
  $('#vpRegion1').hide();
  $('#vpRegion2').hide();
  $('#vpRegion3').hide();
  $('#Board').hide();
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* Show All header fields locked, Checklist/Browser, Checklist is read only, Additional Checklist, Approval signature section, Deny and Submit button, and SendTo Operations/Legal */
function initICCApproval(){
  log("Method: initICCApproval");
  activeFormStep = "ICCApproval";

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').show();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  enableSignatureItem("_1_1_110_1_checkbox", "_1_1_111_1", "_1_1_112_1");

  /* Comments Section */
  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  $('#DenialButton').val("Not Recommended");
  $('#Deny_This_Request').val("Submit");
  $('#DenialReason').text("Reason for Not Recommending");
  hideSendToStepOptions();
  enableSendTo();

  /* Hide Signature Inputs */
  $('#RVP').hide();
  $('#CEOCFO').hide();
  $('#CreditICC').show();
  $('#CEOICC').hide();
  $('#CFOICC').hide();
  $('#vpLegalICC').hide();
  $('#vpRegion1').hide();
  $('#vpRegion2').hide();
  $('#vpRegion3').hide();
  $('#Board').hide();
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* Show All header fields locked, Checklist/Browser, Checklist is read only, Additional Checklist, Approval signature section, Deny and Submit button, and SendTo Operations/Legal */
function initBoardApproval(){
  log("Method: initBoardApproval");
  activeFormStep = "BoardApproval";

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').show();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  enableSignatureItem("_1_1_131_1_checkbox", "_1_1_132_1", "_1_1_134_1");

  /* Comments Section */
  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').show();
  $('#DenialButton').val("Not Recommended");
  $('#Deny_This_Request').val("Submit");
  $('#DenialReason').text("Reason for Not Recommending");
  hideSendToStepOptions();

  /* Hide Signature Inputs */
  $('#RVP').hide();
  $('#CEOCFO').hide();
  $('#CreditICC').hide();
  $('#CEOICC').hide();
  $('#CFOICC').hide();
  $('#vpLegalICC').hide();
  $('#vpRegion1').hide();
  $('#vpRegion2').hide();
  $('#vpRegion3').hide();
  $('#Board').show();
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* initialize status methods */
function initCreditFinalization(){
  log("Method: initCreditFinalization");
  activeFormStep = "CreditFinalization";
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */

 /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Signature_Section .note').hide();
  $('#Recommendation_Signature_Section').show();
  $('#Recommendation_Signature_Section .note').hide();
  $('#Approval_Signature_Section').show();
  $('#Approval_Signature_Section .note').hide();
  $('#Final_Signature_Section').show();
  $('#Final_Signature_Section .note').show();
  $('#Collect_Final_Signature_Section').show();
  $('#Collect_Final_Signature_Section .note').hide();

  enableSignatureItem("_1_1_134_1_checkbox", "_1_1_135_1", "_1_1_136_1");
  
  /* Comments Section */
  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').hide();
  hideSendToStepOptions();

  /* Hide Signature Inputs */
  $('#CreditICC').hide();
  $('#CEOICC').hide();
  $('#CFOICC').hide();
  $('#vpLegalICC').hide();
  $('#vpRegion1').hide();
  $('#vpRegion2').hide();
  $('#vpRegion3').hide();
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
  hideSpecificSignatureSection(field_RVP,'RVP');
  hideSpecificSignatureSection(field_CEOCFO,'CEOCFO');
  hideSpecificSignatureSection(field_CreditICC,'CreditICC');
  hideSpecificSignatureSection(field_Board,'Board');
}

/* initialize status methods */
function initCollectRemainingDocuments(){
  log("Method: initCollectRemainingDocuments");
  activeFormStep = "CollectRemainingDocuments";
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */

 /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').show();
  $('#Final_Signature_Section').show();
  $('#Collect_Final_Signature_Section').show();

  enableSignatureItem("_1_1_137_1_checkbox", "_1_1_138_1", "_1_1_139_1");
  
  /* Comments Section */
  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').hide();
  hideSendToStepOptions();

  /* Hide Signature Inputs */
  $('#CreditICC').hide();
  $('#CEOICC').hide();
  $('#CFOICC').hide();
  $('#vpLegalICC').hide();
  $('#vpRegion1').hide();
  $('#vpRegion2').hide();
  $('#vpRegion3').hide();
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
  hideSpecificSignatureSection(field_RVP,'RVP');
  hideSpecificSignatureSection(field_CEOCFO,'CEOCFO');
  hideSpecificSignatureSection(field_CreditICC,'CreditICC');
  hideSpecificSignatureSection(field_Board,'Board');
}

/* initialize status methods */
function initLoanPrintView(){
  log("Method: initLoanPrintView");
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */

  /* Header Fields */
  $('#Loan_Number_Div').hide();
  $(field_Loan_Number).removeClass("required");

  //hide the coments edit and display (localized version) for print
  $(field_Comments + '_NewComment').hide();
  $(field_Comments + '_Display').hide();
  $(field_Comments + '_Print').show();
  $(field_Denials + '_NewComment').hide();
  $(field_Denials + '_Display').hide();
  $(field_Denials + '_Print').show();

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').show();
  $('#Final_Signature_Section').show();
  $('#Collect_Final_Signature_Section').show();
  
  makePrintReady();

  $('#SubmitButton').hide();

  //$("input").attr('disabled', 'disabled'); //disable
  $('input').prop("disabled", true); //disable

  $('#PrintViewButtons input').prop("disabled", false);
  
  /* TODO These next items don't work.  Get Brian to fix and test them properly */
  $("#PrintViewEditButton").hide();
  $("#PrintViewCancelButton").hide();
  $("#PrintViewSubmitButton").hide();
  if(userIsPrintViewIT == "TRUE"){ 
    $("#PrintViewEditButton").show();
  }
  //$("#PrintViewSubmitButton").hide();
  //$("#PrintButton input").attr('disabled', 'enabled'); //enabled
}

/*** Referral only steps ***/

/* initialize status methods */
function initAMLAssistance(){
  log("Method: initAMLAssistance");
  activeFormStep = "AMLAssistance";
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').hide();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').hide();
  $('#SubmitButton').hide();
  hideSendToStepOptions();

  /* Hide Signature Inputs */
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* initialize status methods */
function initRVPLoanReview(){
  log("Method: initRVPLoanReview");
  activeFormStep = "RVPLoanReview";
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').hide();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').hide();
  $('#SubmitButton').hide();
  hideSendToStepOptions();
  enableSendTo();

  /* Hide Signature Inputs */
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* initialize status methods */
function initFieldOfficeCorrection(){
  log("Method: initFieldOfficeCorrection");
  activeFormStep = "FieldOfficeCorrection";
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */

  /* Header Fields */

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').hide();
  $('#SubmitButton').hide();
  hideSendToStepOptions();
  enableSendTo();

  /* Hide Signature Inputs */
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* initialize status methods */
function initRVPandFieldOfficeCorrection(){
  log("Method: initRVPandFieldOfficeCorrection");
  activeFormStep = "RVPandFieldOfficeCorrection";
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */

  /* Header Fields */

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').hide();
  $('#SubmitButton').hide();
  hideSendToStepOptions();

  /* Hide Signature Inputs */
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* initialize status methods */
function initLegalLoanReview(){
  log("Method: initLegalLoanReview");
  activeFormStep = "LegalLoanReview";
  /* Hide all fields and all buttons except for BP Name, Loan Type, Amount, Field Office, and the Submit Button */

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').show();
  $('#Recommendation_Signature_Section').show();
  $('#Approval_Signature_Section').hide();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').hide();
  $('#SubmitButton').hide();
  hideSendToStepOptions();

  /* Hide Signature Inputs */
  hideSpecificSignatureSection(field_CEOConsideration,"CEOConsideration");
  hideSpecificSignatureSection(field_SeniorAMLSignature,"SeniorAMLRecommendation");
  hideSpecificSignatureSection(field_CEOOverride,"CEOOverride");
}

/* Show All header fields locked, Checklist/Browser, Checklist is read only, Additional Checklist, Approval signature section, Deny and Submit button, and SendTo Operations/Legal */
function initCreditReview(){
  log("Method: initCreditReview");
  activeFormStep = "CreditReview";

  /* Header Fields */
  $('#BP_And_Loan_Section .valueEditable').attr("disabled", true);
  $('#Loan_Section .valueEditable').attr("disabled", true);
  $('#addLoanRow').hide();
  $('#Info_Section .valueEditable').attr("disabled", true);

  /* Checklist Fields */
  $('#Checklist_Section').show();
  $('#Checklist_Section .valueEditable').attr("disabled", true);
  showAdditionalProposalChecklist("");

  /* Signatures Fields */
  $('#Signature_Section').hide();
  $('#Recommendation_Signature_Section').hide();
  $('#Approval_Signature_Section').show();
  $('#Final_Signature_Section').hide();
  $('#Collect_Final_Signature_Section').hide();

  /* Hide Signature Inputs */
  $('#RVP').show();
  $('#CEOCFO').hide();
  $('#CreditICC').hide();
  $('#CFOICC').hide();
  $('#vpLegalICC').hide();
  $('#CEOICC').hide();
  $('#vpRegion1').hide();
  $('#vpRegion2').hide();
  $('#vpRegion3').hide();
  $('#Board').hide();
  
  /* Comments Section */
  $('#Deny_Section').hide();

  /* Buttons */
  $('#DenyButton').hide();
  $('#SubmitButton').hide();
  hideSendToStepOptions();
}

  
/**************************************************************************************************************/
/**************************************************************************************************************/
                            /* END Loan Proposal Views Initiaization */
/**************************************************************************************************************/
/**************************************************************************************************************/
  
/**************************************************************************************************************/
/**************************************************************************************************************/
                            /* User Button Lookup Functions */
/**************************************************************************************************************/
/**************************************************************************************************************/

function chooseUser_1_1_4_1()
{
var		url;
var		w;

url = '/otcs/llisapi.dll?func=user.SelectUserDlg&formname=myForm&fieldprefix=_1_1_4_1&title=Select%20User&DisplayUserName&NoGroups=FALSE';

url = url + '&NoGroupsSelectable=TRUE'
w = window.open(url,"","height=340,width=680,scrollbars=yes,resizable=yes,menubar=no,toolbar=yes,status=yes");

if ( w.focus )
{
w.focus();
}
}

function KeepFieldSet_1_1_4_1( nameField, savedValue )
{
if ( nameField.value != '' )
{
alert( "You can't enter text in by hand. Use the link to the right." );
nameField.value = savedValue;
}
else if ( markDirty != null )
{
markDirty();
}

if ( nameField.value == savedValue.value )
{
savedValue.value = nameField.value;
}
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                            /* END User Button Lookup Functions */
/**************************************************************************************************************/
/**************************************************************************************************************/

/**************************************************************************************************************/
/**************************************************************************************************************/
                            /* Approval Table Lookup Functions */
/**************************************************************************************************************/
/**************************************************************************************************************/

/* Calls a web report to Get a delimited supervisor and department for the users. */
function setEmployeeInformation(userToFind, managerField, departmentField, defaultManagerField, defaultDepartment) {
}
  
/**************************************************************************************************************/
/**************************************************************************************************************/
                            /* Allen's Code */
/**************************************************************************************************************/
/**************************************************************************************************************/
/*Global Constants*/
var folderJSON;
var folderArray;
var persistJSON;
var persistArray = [];
var preDateToken = "[{$d";
var preUserToken = "[{$u";
var preCountryToken = "[{$c";
var preBPNumberToken = "[{$b";
var preBPNameToken = "[{$n";
var preWorkspaceIDToken = "[{$w";
var postToken = "$}]";

      /* TODO  where is this used? */
      $(document).on('keyup', '.numeric-only', function(event) {
        var v = this.value;
        if($.isNumeric(v) === false) {
          //chop off the last char entered
          this.value = this.value.slice(0,-1);
        }
      });

/*Removed for old accordion*/      
/*      $(function() {
        $( "#accordion" ).accordion({
          collapsible: true,
          active: false,
          heightStyle: "content",
          animate:false
        });
      });*/

      //*************************************************************
/* function toggleRow(theNode,open_close)
{

  var theJSON;
  theNode = "#" + theNode;
  open_close  = "#" + open_close;
  if( $(open_close).attr('class') == "laad-open")
  {
     // remove class from open list
     $(open_close).removeClass("laad-open");
     $(open_close).addClass("laad-plus");
     removeFromFolderArray(persistArray,theNode.replace("#",""));
     //convert the js array to JSON
     theJSON = folderArray2JSON(persistArray);
     //save the JSON to a cookie
     $.cookie("open_folder",theJSON,{expires:365});     

  }
else
 {
     // add the class to open list
     $(open_close).removeClass("laad-plus");
     $(open_close).addClass("laad-open");
     addFolderToArray(persistArray,theNode.replace("#",""));
     theJSON = folderArray2JSON(persistArray);
     //save the JSON to cookie
     $.cookie("open_folder",theJSON,{expires:365});
   
   
}
  $(theNode).toggle();
}*/

//******************************************************************

//************************** Next Process Determination ***************************************************
function determineNextStep() {
  var currentStatus = $(field_Status).val();
  var action = $(field_Action).val();
  var subaction = $(field_Subaction).val();
}

/**************************************************************************************************************/
                            /* Audited Comment Field Functions */
/**************************************************************************************************************/

/* Based on the three standard comment fields, set the appropriate values and what is showing */
/* TODO Allen coded a display field AND a Print field.  I think that these have the same function and can be combined. */
function setDisplayComments(commentValueFieldID, commentDisplayFieldID, commentPrintFieldID) {
  var comments = $(commentValueFieldID).val();
  var newComments = removeDelimeters(comments);
  var newPrintComments = convertLineBreaksToBR(removeDelimeters(comments));
  $(commentDisplayFieldID).val(newComments);
  $(commentPrintFieldID).html(newPrintComments);
}

/* Determine if the important comment field was checked prior to this step, and if it is still checked, then indicate that it must be unchecked. */
/* TODO need to pass in the field names so that this can become generic */
function validateImportantComment() {
  var result = true;
  if (savedImportantCommentFlag == 1) {
    if ($(field_ImportantComment + "_checkbox").is(":checked")) {
      $(field_ImportantComment + "_checkbox").prop('disabled', false);
      $(field_ImportantComment + "_checkbox").addClass('required-error');
      $(field_Comments + "_Display").addClass('required-error');
      result = false;

      //For each field that fails validation, add the Red background */
      $(field_ImportantComment + "_checkbox").change(function() {
        uncheckImportantCommentFlag(savedImportantCommentFlag, field_ImportantComment, field_Comments);
        savedImportantCommentFlag = 0;
      });
      $(field_ImportantComment + "_checkbox").click(function() {
        uncheckImportantCommentFlag(savedImportantCommentFlag, field_ImportantComment, field_Comments);
        savedImportantCommentFlag = 0;
      });
    }
    else if (!$(field_Comments + "_NewComment").val()){
      uncheckImportantCommentFlag(savedImportantCommentFlag, field_ImportantComment, field_Comments);
      savedImportantCommentFlag = 0;
    }
  }
  enableOrDisableImportantCommentFlag(savedImportantCommentFlag, field_ImportantComment, field_Comments);
  return result;
}

/* We are disabeling the Important Comment filed, clearing it's checked state, and removing the events */
function uncheckImportantCommentFlag(savedImportantCommentFlag, importantCommentField, commentsField) {
  $(importantCommentField + "_checkbox").removeClass('required-error');
  $(commentsField + "_Display").removeClass('required-error');
  $(importantCommentField + "_checkbox").unbind( "change" );
  $(importantCommentField + "_checkbox").unbind( "click" );
  enableOrDisableImportantCommentFlag(savedImportantCommentFlag, importantCommentField, commentsField);
}

/* Set conditions for disabling and enabling the Important Comment checkbox */
function enableOrDisableImportantCommentFlag(savedImportantCommentFlag, importantCommentField, commentsField) {
  if ($(commentsField + "_NewComment").val() || (savedImportantCommentFlag && $(importantCommentField + "_checkbox").is(":checked"))){
    $(importantCommentField + "_checkbox").prop('disabled', false);
  }
  else {
    $(importantCommentField + "_checkbox").prop('checked', false);
    $(importantCommentField + "_checkbox").prop('disabled', true);
  }
}

/* Determine the value of Denial and validate a reason was entered */
function validateNotRecommended() {
  var result = true;
  
  if (($(field_Subaction).val() == "Cancel") && !($(field_Denials + "_NewComment").val()))  {
    result = false; 
    $(field_Denials + "_NewComment").addClass('required-error');
  }
  return result;
}

/* Determine the value of Denial and validate a reason was entered */
/* TODO Need to make this generic based on 1 field causing a comment field to be required. Currently just coded to the Deny field. */
function validateDeny() {
  var result = true;
  
  if (($(field_Denied).val() == "1" || $(field_Denied).val() == "true") && !($(field_Denials + "_NewComment").val() || $(field_Denials).val()))  {
    result = false; 
    $(field_Denials + "_NewComment").addClass('required-error');
  }
  return result;
}

/* We assume that the comments are updated already.  Denials are written to the Comments fields, and also processed as their own field. */
function addToDenialComments(denialCommentFieldID, denialChildCommentFieldID, commentFieldID, childCommentFieldID) {
  var newComment = $(denialCommentFieldID + '_NewComment').val();

  //if nothing entered in newComment then do nothing.
  if(!newComment || newComment.length == 0){
    return;
  }
  else {
    addToComments(denialCommentFieldID, denialChildCommentFieldID);
    $(commentFieldID + '_NewComment').val("NOT RECOMMENDED: " + newComment);
    addToComments(commentFieldID, childCommentFieldID);
  }
}

/* Update the comment field from the NewComment Field 
 * TODO This really needs to be cleaned up.
 */
function addToComments(commentFieldID, childCommentFieldID) {
  var userName = $("#LL_UserFullName").val();
  var newComment = $(commentFieldID + '_NewComment').val();

  //if nothing entered in newComment then do nothing.
  if(!newComment || newComment.length == 0){
    return;
  }
  else { 
    var oldComment = $(commentFieldID).val();
    var thisDate = new Date();
    var gmtString = convertLocaltoUTC(thisDate);
    var stamp = preDateToken + gmtString + postToken + " - " + preUserToken + userName + postToken;
    var comments = stamp + " - " + newComment + "\n" + oldComment;
    var displayVersion = removeDelimeters(comments);
    $(commentFieldID).val(comments);
     
    //update the child comments field
    if (childCommentFieldID) {
      var oldChildComment = $(childCommentFieldID).val();
      var childComments = stamp + " - " + newComment + "\n" + oldChildComment;
      $(childCommentFieldID).val(childComments);
    }

    //clear the newComment field
    $(commentFieldID + '_NewComment').val("");
    $(commentFieldID + "_Display").val(displayVersion);
    $(commentFieldID + "_Print").val(displayVersion);
  }
}

/* Called from Add Comment to stamp the samed comment with a date */
function convertLocaltoUTC(localTime) {
  var currentDate = localTime;
  var utcDays = currentDate.getUTCDate();
  var utcYears = currentDate.getUTCFullYear();
  var utcMonth = currentDate.getUTCMonth() + 1;
  var utcHours = currentDate.getUTCHours();
  var utcMinutes = currentDate.getUTCMinutes();
  var utcSeconds = currentDate.getUTCSeconds();
  var outGMT = utcMonth + "/" + utcDays + "/" + utcYears + " " + utcHours + ":" + utcMinutes + ":" + utcMinutes;
  outGMT = outGMT + " UTC";
  return outGMT;
}
  
/* Called from Add Comment to stamp the samed comment with a time */
function getLocalTimeZone() {
  var date = new Date();
  var dateST = date.toString()
  var tz;
  var lParm = dateST.indexOf("(");
  var rParm = dateST.indexOf(")");

  if ((lParm == -1) || (rParm == -1)) {
    tz = "";
  }
  else {
    tz = dateST.substring(lParm + 1, rParm);
  }
  
  return tz;
}

/* Process the comment delmiters and replace them with the display information */
/* TODO This really needs to be cleaned up. */
function removeDelimeters(comments) {
  var isFinished = false;
  var s_idx;
  var e_idx;
  var lastChar;
  var i = 0;

  if (comments) {
    while(!isFinished) {
      i = i + 1;
      s_idx = comments.indexOf(preDateToken);
      if (s_idx == -1) {
         isFinished = true;
      }
      else {
        //find the close tag  
        var restOfString = comments.substring(s_idx + preDateToken.length,comments.length - 1);
        e_idx = restOfString.indexOf(postToken);
        if (e_idx == -1) {
          //no close tag found
          isFinished = true;
        }
        else {
          lastChar = e_idx + postToken.length;
          var tagVal = restOfString.substring(0,e_idx);
          var fullTag = preDateToken + tagVal + postToken;

          var lDate = new Date(tagVal);
          var outDate = new Date();
          var outString = (lDate.getMonth() +1) + "/" + lDate.getDate() + "/" + lDate.getFullYear();
          outString = outString + " " +lDate.getHours() + ":" + lDate.getMinutes() + ":" + lDate.getSeconds();
          outString = outString + "(" +  getLocalTimeZone() + ")";
          var newDate = lDate.toString();

          comments = comments.replace(fullTag,outString);        
        }
      }
    }
  }
  
  //now get rid of the user delimeters
  isFinished = false;
  if (comments) {
    while(!isFinished) {
      if(comments.indexOf(preUserToken) == -1) {   
        isFinished = true;
      }
      else {
        comments = comments.replace(preUserToken,"");
      }
    }
  }

  //now get rid of the user end tags
  isFinished = false;
  if (comments) {
    while(!isFinished) {
      if(comments.indexOf(postToken) == -1) {   
        isFinished = true;
      }
      else {
        comments = comments.replace(postToken,"");
      }
    }
  }
  return comments;
}

  
function convertLineBreaksToBR (str) {   
  var breakTag = '<br />';    
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

/**************************************************************************************************************/
                            /* Workspace Accordion Functions */
/**************************************************************************************************************/
  
/*Sets the sort column header decorations of the accordion display*/
function setAccordionSort(sortCol) {
  var notCurrURL = appSupportPath + "LAAD/images/sort_asc.png";
  var currURL = appSupportPath+ "LAAD/images/sorted_ascending.png";
    
  if(sortCol == "Name") {
    $("#header_name").attr("src",currURL);
  }
  else {
    $("#header_name").attr("src",notCurrURL);
  }

  if(sortCol == "ModifyDate") {
    $("#header_ModifyDate").attr("src",currURL);
  }
  else {
    $("#header_ModifyDate").attr("src",notCurrURL);
  }

  if(sortCol == "VersionNum") {
    $("#header_VersionNum").attr("src",currURL);
  }
  else {
    $("#header_VersionNum").attr("src",notCurrURL);
  }
}
    
//************************** ICC FUNCTIONS ***************************************************
/* If the ICC Loan Proposal has changed, then clear the info information and reload it */ 
function loanProposalSelected() {
  //clear any existing data
  $('#Product').val("");
  $('#PurposeofLoan').val("");
  $('#TotalExposure').val("");
  $('#GroupExposure').val("");
	enableSignatureItem("iccSignor_checkbox", "iccSignor", "iccSignorName");
  var selectedIccLoan = $('#iccLoanProposals').find(":selected").text();
  if(selectedIccLoan && selectedIccLoan != "<Select One>") {
    loadIccLoanInfoList();
  }
}

function loanRoleSelected() {
	enableSignatureItem("iccSignor_checkbox", "iccSignor", "iccSignorName");
  var role = $("#Role_Selector option:selected" ).val();
  if (role && role != "") {
    $("#Recommended_label").text(role + " Recommended");
  }
}

/* Calls a web report to fill the selection list for the ICC Loan based on the Volume ID of the selected. */
function loadIccLoanInfoList() {
}

/* Calls a web report to sign the ICC Loan based on the Volume ID of the selected. */
function signICCLoan() {
}

//************************** FIELD OFFICE FUNCTIONS ***************************************************
/* If the Field office has changed, then clear the BP information and reload it */ 
function fieldOfficeSelected() {
  //clear any existing data
  $(field_BP_Name).val("");
  $(field_BP_Number).val("");
  $(field_BP_Workspace_ID).val("");
  $(field_BP_Workspace_Path).val("");
  var selectedFieldOffice = $(field_Field_Office).find(":selected").text();
  if(selectedFieldOffice && selectedFieldOffice != "<Select One>") {
    loadBPSelectionList();
    if (loanProposalForm) {loadFieldOfficeAssignments(selectedFieldOffice);}
  }
  filterLoanListByFieldOffice(selectedFieldOffice);
}

function setBPFromLoan() {
  var selectedLoanProposal = $('#Loan_Proposal').find(":selected").val();
  if(selectedLoanProposal && selectedLoanProposal != "none") {
    var selectedLoanValues = selectedLoanProposal.split(",");
    var selectedBP = selectedLoanValues[1] + "," + selectedLoanValues[2];
    $("#BP_Selector option").filter(function() {
      return $(this).val().indexOf(selectedBP) > -1; 
    }).attr('selected', true);
    newBPSelected();
  }
}

/* Calls a web report to fill the assignments based on the selected Field Office. */
function loadFieldOfficeAssignments(selectedFieldOffice) {
}

//************************** BP FUNCTIONS ***************************************************

/* Find the option that is supposed to be selected, and set it as selected. */
function setSelectedBPFromValue() {
  var bpName = $(field_BP_Name).val();
  if (bpName) {
    $("#BP_Selector option").filter(function() {
      return $(this).text().indexOf(bpName) > -1; 
    }).attr('selected', true);
  }
}

/* Calls a web report to fill the selection list for the Business Partners based on the Country Code of the selected Field Office. */
function loadBPSelectionList() {
}

/* When the BP Name is selected from the drop down, then load the BP Name, BP Number, BP Workspace ID, and make a call to load the Workspace Path */
function newBPSelected() {
  var bpName = $("#BP_Selector :selected").text();
  var newBPVal = $( "#BP_Selector option:selected" ).val();
  if (newBPVal && newBPVal != "None") {
    var bpName = $("#BP_Selector :selected").text();
    $(field_BP_Name).val(bpName);

    var newIDs = newBPVal.split(",");

    var bpNumber = newIDs[0];
    if (bpNumber) {bpNumber = bpNumber.trim();}
    $(field_BP_Number).val(bpNumber);

    var workspaceID = newIDs[1];
    if (workspaceID) {workspaceID = workspaceID.trim();}
    $(field_BP_Workspace_ID).val(workspaceID);

    loadWorkspacePath();
    $("#viewAttach").prop('disabled', false); //enable Attachments
  }
  else {
    $(field_BP_Name).val("");
    $(field_BP_Number).val("");
    $(field_BP_Workspace_ID).val("");
    $(field_BP_Workspace_Path).val("");
    $(field_BP_Workspace_Path).val("");
    $("#viewAttach").prop('disabled', true); //Disable Attachments
  }
}    

/* Calls a web report to fill the workspace path based on the ID */
function loadWorkspacePath() {
}

/* Calls a web report to list the Business Partners based on the Country Code for the Business Partner. */
function bp_getbpAutocompleteArray(countryName, isLoad) {
}

/* Calls a web report to list the Business Partners based on the Country Code for the Business Partner. */
function loabBPAutocomplete() {
}

/* Load the BP Name Drop down with the list from the bpAutocompleteArray array */
function loadBPNameDDLB() {
  var $el = $("#BP_Selector");
  //clear the options from the select list
  $el.empty();

  //load the select with the contents of the bpAutocompleteArray
  $.each( bpAutocompleteArray, function( index, value ) {
    $el.append($("<option></option>").val(value).html(value));
  });
}

function getBPNodeID(bpNumber,bpName,countryName) {
}
    //************************* End of BP Functions  ********************************************

/**************************************************************************************************************/
/**************************************************************************************************************/
                            /* END Allen's Code */
/**************************************************************************************************************/
/**************************************************************************************************************/

/**************************************************************************************************************/
/**************************************************************************************************************/
                            /* Martina's Code */
/**************************************************************************************************************/
/**************************************************************************************************************/

//************************** LOAN EXPANDER FUNCTIONS ***************************************************
var loanCounter = 1;
var newRowCounter = 1;
var maxLoanCounter = 3;
var allLoanTypes = {"<Select One>":"","Term Loan":"Term Loan","Revolving Line":"Revolving Line","Equity Investment":"Equity Investment","Restructure":"Restructure","Reschedule":"Reschedule","Change of Terms":"Change of Terms"};
var multirowLoanTypes = {"<Select One>":"","Term Loan":"Term Loan","Revolving Line":"Revolving Line","Change of Terms":"Change of Terms"};
var multirowLoanTypeNames = ["Term Loan","Revolving Line","Change of Terms"];
var multipleValuesAllowedLoanTypeNames = ["Revolving Line"];

/* Process the addition of loan rows and copy the existing values to the new rows.*/
function initLoanWidget() {
  log("Method: initLoanWidget");
  var totalRows = getNumberLoans();
  newRowCounter = totalRows;
  for (var row = 1; row <= totalRows; row++) {
    var rowIdentifier = "";
    if (row > 1) {
      rowIdentifier = "_" + row;
      addLoanRowManually(row);
    } //end if

    var existingButtonName = "ExistingButton" + rowIdentifier;
    $("input[name~='" + existingButtonName + "'][value='" + $("#_1_1_38_" + row + "_45_1").val() + "']").prop("checked", "true");
    $("#LoanType" + rowIdentifier).val($("#_1_1_38_" + row + "_40_1").val());
    $("#LoanAmount" + rowIdentifier).val($("#_1_1_38_" + row + "_41_1").val());
    formatAmount("#LoanAmount" + rowIdentifier, "currency", true);
    $("#ChangeOfTerms" + rowIdentifier).val($("#_1_1_38_" + row + "_42_1").val());
    setLoanTypeOptions();
  } //end for
  $("#DeleteLoanRow").hide();
  addLoanExpander();
  
  /*Internal function to the init that adds a row to the loan array*/
  function addLoanRowManually(rowNumber) {
    var sourceNode = document.getElementById("ExpandingLoanDIV");
    var node = duplicateNodeManually(rowNumber, sourceNode, ["id", "name", "placeholder"]);
    sourceNode.parentNode.appendChild(node);
  }

  /* Internal function that increments IDs on the new loan node */
  function duplicateNodeManually(rowNumber, sourceNode, attributesToBump) {
    var out = sourceNode.cloneNode(true);
    if (out.hasAttribute("id")) { out["id"] = bumpManually(rowNumber, out["id"]); }
    var nodes = out.getElementsByTagName("*");
        
    for (var i = 0, len1 = nodes.length; i < len1; i++) {
      var node = nodes[i];
      for (var j = 0, len2 = attributesToBump.length; j < len2; j++) {
        var attribute = attributesToBump[j];
        if (node.hasAttribute(attribute)) {
          node[attribute] = bumpManually(rowNumber, node[attribute]);
        }
      }
    }//endfor
      
    function bumpManually(rowNumber, str) {
      var names = str.split("_");
      return names[0] + "_" + rowNumber;
    }
    return out;
  }//end duplicateNodeManually
};

/* Store the values of the loan rows back to their fields by getting all the rows of the expanding div, and stepping through them sequentially.*/
function saveLoanWidget() {
  var totalRows = getNumberLoans();
  var row = 0;
 
  $("[id^='ExpandingLoanDIV']").each(function(index, element) {
    row++; //this should only get to 10.
    var idSplit = this.id.split("_");
    var rowIdentifier = "";
    if (idSplit.length > 1) {  //first row has no added _##
      rowIdentifier = "_" + idSplit[1];
    } //end if
    var existingButtonName = "ExistingButton" + rowIdentifier;
    $("#_1_1_38_" + row + "_45_1").val($("input[name~='" + existingButtonName + "']:checked").val());
    $("#_1_1_38_" + row + "_40_1").val($("#LoanType" + rowIdentifier).val());
    formatAmount("#LoanAmount" + rowIdentifier, "real", false);
    $("#_1_1_38_" + row + "_41_1").val($("#LoanAmount" + rowIdentifier).val());
    $("#_1_1_38_" + row + "_42_1").val($("#ChangeOfTerms" + rowIdentifier).val());
    if ($(field_Collect_Signature + '_checkbox').is(':checked')){ $("#_1_1_38_" + row + "_182_1").val('1'); }
  });

  for (clearRow = row + 1;clearRow <=10;clearRow++) {
    $("#_1_1_38_" + clearRow + "_45_1").val("");
    $("#_1_1_38_" + clearRow + "_40_1").val("");
    $("#_1_1_38_" + clearRow + "_41_1").val("");
    $("#_1_1_38_" + clearRow + "_42_1").val("");
    $("#_1_1_38_" + clearRow + "_182_1").val("");
  }
}

/* Get Number of Loans for loan expander  _1_1_181_1 */
function getNumberLoans() { 
  var numberOfLoans = $(field_Number_Of_Loans).val();
  if (numberOfLoans < 1) {
    numberOfLoans = 1;
  }
  return numberOfLoans;
}

/* new loan add rows */
function addLoanExpander() {
  log("Method: addLoanExpander");
  addRowButton = document.getElementById("addLoanRow");
  addRowButton.addEventListener("click", function() {
    setMaxRowsFromLoanType("LoanType");
    loanCounter = getNumberLoans();
    if (loanCounter < maxLoanCounter) {
      loanCounter++; //increment the total number of rows
      var sourceNode = document.getElementById("ExpandingLoanDIV");
      var node = duplicateNode(sourceNode, ["id", "name", "placeholder"]);
      sourceNode.parentNode.appendChild(node);
      $(field_Number_Of_Loans).val(loanCounter);
      initializeNewRow();
    } //endif
  }, false);

  function initializeNewRow() {
    var rowIdentifier = "_" + newRowCounter;
    var existingButtonName = "ExistingButton" + rowIdentifier;
    $("input[name~='" + existingButtonName + "'][value='N']").prop("checked", "true");
    $("#LoanType" + rowIdentifier).val($("#_1_1_38_" + loanCounter + "_40_1").val());
    $("#LoanAmount" + rowIdentifier).val($("#_1_1_38_" + loanCounter + "_41_1").val());
    formatAmount("#LoanAmount" + rowIdentifier, "currency", true);
    $("#ChangeOfTerms" + rowIdentifier).val($("#_1_1_38_" + loanCounter + "_42_1").val());
    $("#DeleteLoanRow" + rowIdentifier).show();
    
    setLoanTypeOptions();
  }

  /* If the first row is not Term, Revolving, or Change, then max rows is 1 otherwise 3*/
  function setMaxRowsFromLoanType(selectId) {
    if ($("#"+selectId + " option:selected").val() == "" || $.inArray($("#"+selectId + " option:selected").val(), multirowLoanTypeNames) > -1) {
      maxLoanCounter = 3;
    }
    else {
      maxLoanCounter = 1;
    }
  } 
  
  function duplicateNode(/*DOMNode*/sourceNode, /*Array*/attributesToBump) {
    newRowCounter++; //increment the unique row counter
    var out = sourceNode.cloneNode(true);
    if (out.hasAttribute("id")) { out["id"] = bump(out["id"]); }
    var nodes = out.getElementsByTagName("*");
      
    for (var i = 0, len1 = nodes.length; i < len1; i++) {
      var node = nodes[i];
      for (var j = 0, len2 = attributesToBump.length; j < len2; j++) {
        var attribute = attributesToBump[j];
        if (node.hasAttribute(attribute)) {
          node[attribute] = bump(node[attribute]);
        }
      }
    }//endfor
    
    function bump(/*String*/str) {
      var names = str.split("_");
      return names[0] + "_" + newRowCounter;
    }
    return out;
  }//end duplicateNode
};//end addLoanExpander
  
/* Remove Loan  - need to remove value of total loans too*/
function removeLoan(node) {
  loanCounter = getNumberLoans();
  if (loanCounter > 1) {
    current_loan = document.getElementById("ExpandingLoanDIV");
    myrow = node.parentNode;
   
    if (myrow == current_loan) {
    }
    else{
      row = 0;
      var idArray = $(myrow).attr('id').split("_");
      var rowIdentifier = "";
      if (idArray.length > 1) {
        rowIdentifier = idArray[1];
      }
      loanCounter--;
      myrow .parentNode.removeChild(myrow);
      $(field_Number_Of_Loans).val(loanCounter);
      saveLoanWidget();
    }
  }
  setLoanTypeOptions();
}

/*Starting with the first row, loop through and make sure that we manage the rules*/
function setLoanTypeOptions() {
  var totalRows = getNumberLoans();
  var row = 0;
  var totalAmount = 0;
  var valuesArray = [];

  $("[id^='ExpandingLoanDIV']").each(function(index, element) {
    row++; 
    var idSplit = this.id.split("_");
    var rowIdentifier = "";
    var currentValue = "";
    
    if (idSplit.length > 1) {  //first row has no added _##
      rowIdentifier = "_" + idSplit[1];
    } //end if

    //The First Row can be any value, unless there is more than 1 row
    if (row == 1) {
      setSelectOptions("LoanType", allLoanTypes, new Array());
      currentValue = $("#LoanType" + rowIdentifier + " option:selected").val();
    }
    if (row == 2) {
      setSelectOptions("LoanType", multirowLoanTypes, new Array());
    }
    
    //The first row and all others can only be a multirow option
    if (row > 1) {
      setSelectOptions("LoanType" + rowIdentifier, multirowLoanTypes, valuesArray);
      currentValue = $("#LoanType" + rowIdentifier + " option:selected").val();
      
    }
    
    validateChangeOfTerms(currentValue, rowIdentifier);
    validateNewexisting(currentValue, rowIdentifier);
    
    if (currentValue != "") {
      valuesArray.push(currentValue);
    }
  });
}

/* clear the old options, and take the past list of options and apply it to the select id
   newOptions has the form of an array of "key":"value",...
*/
function setSelectOptions(selectId, newOptions, valuesArray) {
  var selectValue = $("#"+selectId + " option:selected").val();
  var $el = $("#" + selectId);
  $el.empty(); // remove old options
  $.each(newOptions, function(key,value) {
    $el.append($("<option></option>").attr("value", value).text(key));
  }); 
  if (($.inArray(selectValue, multipleValuesAllowedLoanTypeNames) > -1) || !($.inArray(selectValue, valuesArray) > -1)) {
    $("#"+selectId).val(selectValue);
  }
}

/*Update the Change Of Terms required field settings*/
function validateChangeOfTerms(rowType, rowIdentifier) {
  if (rowType == "Change of Terms" || rowType == "") {
    requiredField("#ChangeOfTerms" + rowIdentifier, "#ChangeOfTerms" + rowIdentifier);
    $("#ChangeOfTermsDiv" + rowIdentifier).show();
  }
  else {
    notRequiredField("#ChangeOfTerms" + rowIdentifier, "#ChangeOfTerms" + rowIdentifier);
    $("#ChangeOfTerms" + rowIdentifier).val("");
    $("#ChangeOfTermsDiv" + rowIdentifier).hide();
  }
}

/*Update the NewExisting field settings*/
function validateNewexisting(rowType, rowIdentifier) {
  if (rowType == "Change of Terms" || rowType == "Restructure" || rowType =="Reschedule") {
    $('input[name="ExistingButton"][value="N"]').prop('checked', false);
    $('input[name="ExistingButton"][value="N"]').attr('disabled', true);
    $('input[name="ExistingButton"][value="E"]').prop('checked', true);
  }
  else {
    $('input[name="ExistingButton"][value="N"]').attr('disabled', false);
  }
}

//************************** LINE ITEM EXPANDER FUNCTIONS ***************************************************
var lineitemCounter = 1;
var newLineItemRowCounter = 1;
var maxLineItemCounter = 10;

/* Process the addition of lineItem rows and copy the existing values to the new rows.*/
function initLineItemWidget() {
  var totalRows = getNumberLineItems();
  newLineItemRowCounter = totalRows;
  for (var row = 1; row <= totalRows; row++) {
    var rowIdentifier = "";
    if (row > 1) {
      rowIdentifier = "_" + row;
      addLineItemRowManually(row);
    } //end if

    $("#ItemDate" + rowIdentifier).val($("#_1_1_11_" + row + "_12_1").val());
    $("#ItemDate" + rowIdentifier).datepicker();
    $("#ItemDescription" + rowIdentifier).val($("#_1_1_11_" + row + "_13_1").val());
    $("#Vendor" + rowIdentifier).val($("#_1_1_11_" + row + "_14_1").val());
    $("#Cost" + rowIdentifier).val($("#_1_1_11_" + row + "_15_1").val());
  } //end for
  $("#DeleteLineItemRow").hide();
  addLineItemExpander();
  
  /*Internal function to the init that adds a row to the lineItem array*/
  function addLineItemRowManually(rowNumber) {
    var sourceNode = document.getElementById("ExpandingLineItemDIV");
    var node = duplicateLineItemManually(rowNumber, sourceNode, ["id", "name", "placeholder"]);
    sourceNode.parentNode.appendChild(node);
  }

  /* Internal function that increments IDs on the new lineItem node */
  function duplicateLineItemManually(rowNumber, sourceNode, attributesToBump) {
    var out = sourceNode.cloneNode(true);
    if (out.hasAttribute("id")) { out["id"] = bumpLineItemManually(rowNumber, out["id"]); }
    var nodes = out.getElementsByTagName("*");
        
    for (var i = 0, len1 = nodes.length; i < len1; i++) {
      var node = nodes[i];
      for (var j = 0, len2 = attributesToBump.length; j < len2; j++) {
        var attribute = attributesToBump[j];
        if (node.hasAttribute(attribute)) {
          node[attribute] = bumpLineItemManually(rowNumber, node[attribute]);
        }
      }
    }//endfor
      
    function bumpLineItemManually(rowNumber, str) {
      var names = str.split("_");
      return names[0] + "_" + rowNumber;
    }
    return out;
  }//end duplicateLineItemManually
};

/* Store the values of the lineItem rows back to their fields by getting all the rows of the expanding div, and stepping through them sequentially.*/
function saveLineItemWidget() {
  var totalRows = getNumberLineItems();
  var row = 0;
  var totalAmount = 0;
 
  $("[id^='ExpandingLineItemDIV']").each(function(index, element) {
    row++; //this should only get to 10.
    var idSplit = this.id.split("_");
    var rowIdentifier = "";
    if (idSplit.length > 1) {  //first row has no added _##
      rowIdentifier = "_" + idSplit[1];
    } //end if
    $("#_1_1_11_" + row + "_12_1").val($("#ItemDate" + rowIdentifier).val());
    $("#_1_1_11_" + row + "_13_1").val($("#ItemDescription" + rowIdentifier).val());
    $("#_1_1_11_" + row + "_14_1").val($("#Vendor" + rowIdentifier).val());
    $("#_1_1_11_" + row + "_15_1").val($("#Cost" + rowIdentifier).val());
    totalAmount = addNumbersRounded(totalAmount, $("#Cost" + rowIdentifier).val());
  });
  $(field_Number_Of_Line_Items).val(row);
  $(field_Total_Cost).val(totalAmount);

  for (clearRow = row + 1;clearRow <=10;clearRow++) {
    $("#_1_1_11_" + clearRow + "_12_1").val("");
    $("#_1_1_11_" + clearRow + "_13_1").val("");
    $("#_1_1_11_" + clearRow + "_14_1").val("");
    $("#_1_1_11_" + clearRow + "_15_1").val("");
  }
}

/* Get Number of LineItems for lineItem expander */
function getNumberLineItems() { 
  var numberOfLineItems = $(field_Number_Of_Line_Items).val();
  if (numberOfLineItems < 1) {
    numberOfLineItems = 1;
  }
  return numberOfLineItems;
}

/* new lineItem add rows */
function addLineItemExpander() {
  addRowButton = document.getElementById("addLineItemRow");
  addRowButton.addEventListener("click", function() {
    lineItemCounter = getNumberLineItems();
    if (lineItemCounter < maxLineItemCounter) {
      lineItemCounter++; //increment the total number of rows
      var sourceNode = document.getElementById("ExpandingLineItemDIV");
      var node = duplicateLineItemNode(sourceNode, ["id", "name", "placeholder"]);
      sourceNode.parentNode.appendChild(node);
      $(field_Number_Of_Line_Items).val(lineItemCounter);
      initializeLineItemNewRow();
    } //endif
  }, false);

  function initializeLineItemNewRow() {
    var rowIdentifier = "_" + newLineItemRowCounter;
    //$("#ItemDate" + rowIdentifier).val($("#_1_1_11_" + lineItemCounter + "_12_1").val()); this should be a copy of the first row.
    reinitDatepicker();
    $("#ItemDescription" + rowIdentifier).val($("#_1_1_11_" + lineItemCounter + "_13_1").val());
    //$("#Vendor" + rowIdentifier).val($("#_1_1_11_" + lineItemCounter + "_14_1").val()); this should be a copy of the first row
    $("#Cost" + rowIdentifier).val($("#_1_1_11_" + lineItemCounter + "_15_1").val());
    $("#DeleteLineItemRow" + rowIdentifier).show();
  }
  
  function duplicateLineItemNode(/*DOMNode*/sourceNode, /*Array*/attributesToBump) {
    newLineItemRowCounter++; //increment the unique row counter
    var out = sourceNode.cloneNode(true);
    if (out.hasAttribute("id")) { out["id"] = bump(out["id"]); }
    var nodes = out.getElementsByTagName("*");
      
    for (var i = 0, len1 = nodes.length; i < len1; i++) {
      var node = nodes[i];
      for (var j = 0, len2 = attributesToBump.length; j < len2; j++) {
        var attribute = attributesToBump[j];
        if (node.hasAttribute(attribute)) {
          node[attribute] = bump(node[attribute]);
        }
      }
    }//endfor
    
    function bump(/*String*/str) {
      var names = str.split("_");
      return names[0] + "_" + newLineItemRowCounter;
    }
    return out;
  }//end duplicateNode
};//end addLineItemExpander
  
/* Remove LineItem  - need to remove value of total lineItems too*/
function removeLineItem(node) {
  lineItemCounter = getNumberLineItems();
  if (lineItemCounter > 1) {
    current_lineItem = document.getElementById("ExpandingLineItemDIV");
    myrow = node.parentNode;
   
    if (myrow == current_lineItem) {
    }
    else{
      row = 0;
      var idArray = $(myrow).attr('id').split("_");
      var rowIdentifier = "";
      if (idArray.length > 1) {
        rowIdentifier = idArray[1];
      }
      lineItemCounter--;
      myrow .parentNode.removeChild(myrow);
      $(field_Number_Of_Line_Items).val(lineItemCounter);
      saveLineItemWidget();
    }
  }
}

/* add up all the rows of data to fill the total exposure field. */
function updateLineItemTotals() {
  var totalRows = getNumberLineItems();
  AmountsTotal = 0;
  for (row = 1; row <= totalRows; row++) {
    AmountsTotal = addNumbersRounded(AmountsTotal, $("#_1_1_11_" + row + "_15_1").val());
  }
  $(field_Total_Cost).val(AmountsTotal);
}

//************************** WORKSPACE BROWSER FUNCTIONS ***************************************************
/* file browser sort files */
function sortTable(table, col, reverse) {
    var tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
        tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
        i;
    reverse = -((+reverse) || -1);
    tr = tr.sort(function (a, b) { // sort rows
        return reverse // `-1 *` if want opposite order
            * (a.cells[col].textContent.trim() // using `.textContent.trim()` for test
                .localeCompare(b.cells[col].textContent.trim())
               );
    });
    for(i = 0; i < tr.length; ++i) tb.appendChild(tr[i]); // append each row in order
}

/* file browser sort files */
function makeSortable(table) {
    var th = table.tHead, i;
    th && (th = th.rows[0]) && (th = th.cells);
    if (th) i = th.length;
    else return; // if no `<thead>` then do nothing
    while (--i >= 0) (function (i) {
        var dir = 1;
        th[i].addEventListener('click', function () {sortTable(table, i, (dir = 1 - dir))});
    }(i));
}

/* file browser sort files */
function makeAllSortable(parent) {
    parent = parent || document.body;
    var t = parent.getElementsByTagName('table'), i = t.length;

    while (--i >= 0) makeSortable(t[i]);
}

/* WorkSpace Browser Cookie  */
/* found this code to work with all the checkboxs I have class on for expand/hide cookie  */
function configcookie () {
  var pluses = /\+/g;

  function raw(s) {
    return s;
  }

  function decoded(s) {
    return decodeURIComponent(s.replace(pluses, ' '));
  }

  var config = $.cookie = function (key, value, options) {

    // write
    if (value !== undefined) {
      options = $.extend({}, config.defaults, options);

      if (value === null) {
        options.expires = -1;
      }

      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setDate(t.getDate() + days);
      }

      value = config.json ? JSON.stringify(value) : String(value);

      return (document.cookie = [
        encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path    ? '; path=' + options.path : '',
        options.domain  ? '; domain=' + options.domain : '',
        options.secure  ? '; secure' : ''
      ].join(''));
    }

    // read
    var decode = config.raw ? raw : decoded;
    var cookies = document.cookie.split('; ');
    for (var i = 0, l = cookies.length; i < l; i++) {
      var parts = cookies[i].split('=');
      if (decode(parts.shift()) === key) {
        var cookie = decode(parts.join('='));
        return config.json ? JSON.parse(cookie) : cookie;
      }
    }

    return null;
  };

  config.defaults = {};

  $.removeCookie = function (key, options) {
    if ($.cookie(key) !== null) {
      $.cookie(key, null, options);
      return true;
    }
    return false;
  };

}(jQuery, document);

/* Pull the expand settings from teh cookie, and then set a change function to store any changes in state. */
function setWorkSpaceCookie() {
  $("input.workSpaceExpand").each(function() {
    var mycookie = $.cookie($(this).attr('name'));
    if (mycookie && mycookie == "true") {
      $(this).prop('checked', mycookie);
      if ($(this).attr('name') == 'topAccordion') {
        $("#WorkspaceBrowserExpander").removeClass('fa-plus-square');
        $("#WorkspaceBrowserExpander").addClass('fa-minus-square');
      }
    }
  });
  $("input.workSpaceExpand").change(function() {
    $.cookie($(this).attr("name"), $(this).prop('checked'), {
      path: '/',
      expires: 365
    });
  });
};

function setWorkSpaceExpanderGraphic() {
  $("#topAccordion").change(function() {
    if ($(this).prop('checked')) {
      $("#WorkspaceBrowserExpander").removeClass('fa-plus-square');
      $("#WorkspaceBrowserExpander").addClass('fa-minus-square');
    }
    else {
      $("#WorkspaceBrowserExpander").removeClass('fa-minus-square');
      $("#WorkspaceBrowserExpander").addClass('fa-plus-square');
    }
  });
}

function initRefreshButton() {
  $('#RefreshDocumentList').click(function() {
    if ($('#RefreshDocumentList').hasClass('fa-refresh')) {
      $('#RefreshDocumentList').removeClass('fa-refresh');
      $('#RefreshDocumentList').addClass('fa-spinner');
      reloadDocumentList();
    }
  });
}

/* Calls a web report to reload the file list. */
function reloadDocumentList() {
}

/**************************************************************************************************************/
/**************************************************************************************************************/
                            /* END Martina's Code */
/**************************************************************************************************************/
/**************************************************************************************************************/


(function($) {
  $.fn.setCursorPosition = function (pos) {
    this.each(function (index, elem) {
      if (elem.setSelectionRange) {
        elem.setSelectionRange(pos, pos);
      } else if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    });
    return this;
  };
})(jQuery);

(function ($, undefined) {
  $.fn.getCursorPosition = function() {
    var el = $(this).get(0);
    var pos = 0;
    if (el) {
      if('selectionStart' in el) {
        pos = el.selectionStart;
      } else if('selection' in document) {
        el.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
      }
    }
    return pos;
  }
})(jQuery);