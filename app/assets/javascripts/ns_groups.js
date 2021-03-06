$(function(){
if($('body.ns_groups').length) {
	//VARIABLES
		var user_facility = $('#session-facility').val();
		var user_id = $('#session-authen').val();
		var user_name = $('#session-username').val();

	//STYLING
		//DIV
		$('#divNsGroupPageWrapper')
			.addClass('pad_3_sides')
		$('#divNsGroupPageInnerWrapper')
			.addClass('centered')
			.css({'max-width': '1200px'})

		$('#divNsGrpTitle')
			.css({'text-align': 'center',
					'color': '#2e6e9e',
					'font-size': '17px',
					'font-weight': 'bold',
					'margin': '0 0 7px 0'});

		$('#divSearchAndGrid, #divNsGrpNewEdit, #divFormNsGrpCurrentGrp, #divNsGrpToDoDone, #divNsGrpNotes')
			.addClass('nsgroup_div_spacer1')
			.hide();
		$('#NsGrpsNewEditErrors, #divGrpsPatNoteErrors')
			.addClass('error_explanation')
			.hide();
		$('#div_NsGrp_success_message').hide();


		//forms
		$('#fNsGrpDate, #fNsGrpSearch, #fNsGrpNewEdit, #divFormNsGrpCurrentGrp, #fNsGrpToDoDone, #fNsGrpNotes, #fNsGrpWardPatients')
			.addClass('form_container')
			// .css({'width': '275px'})
		$('#fNsGrpWardPatients')
			.addClass('nsgroup_div_spacer1')

		//selects
		$('#slt_NsGrp_duration').mjm_addOptions('NsGrpDuration', {firstLine: 'Choose'})
		$('#slt_NsGrp_to_do, #slt_NsGrp_done')
			.attr({'size': '10',
				'multiple': 'no'})
			.css({'width': '100%'});

		//button
		$('[id^=bt]').button().addClass('reduce_button')
		// Can't use .hide() as wont work with IE 10
		$('#btnSubmit').addClass('move_off_page')

		//dates
		$('[id^=dt]')
			.datepicker({
				dateFormat: 'yy-mm-dd',
				changeMonth: true,
				changeYear: true,
				yearRange: "-100: +10" })
			.addClass('texts')
			.css({'width':'7em'});

		$('#dt_NsGrp_display')
			.css({'background-color': '#E4E4E4',
				'color': '#5D5D5D',
				'border-color': '#949494'})


		//textboxes
		$('#ftx_GrpName_display')
			.css({'width': '25em',
					'background-color': '#E4E4E4',
					'color': '#5D5D5D',
					'border-color': '#B5B5B5'});
		$('#ftx_GrpDate_display')
			.css({'width': '7em',
					'background-color': '#E4E4E4',
					'color': '#5D5D5D',
					'border-color': '#B5B5B5'});
		$('#ftx_PatNote_display')
			.css({'width': '20em',
					'background-color': '#E4E4E4',
					'color': '#5D5D5D',
					'border-color': '#B5B5B5'});

			// $('#txt-NsGrp-ShowFacility')
			// 	.prop('readonly', true)
			// 	.css({'width': '7em', 
			// 			'background-color': '#F5F5F5',
			// 			'text-align': 'center',
			// 			'color': '#2e6e9e'})
		
		//textareas
		$('[id^=txa]')
			.addClass('text-content left')
			.width('92%')
			.height(100);


	//DATES
	$('#dt_NsGrp_input').change(function(){
		$('#divSearchAndGrid').show();
		//Clear and Hide Current Group, Todo/done, Note for, add Patient if any open
		clear_notes_div_selections();
		clearFields_note1();
		clear_add_patient_to_group();
		clear_current_group_headings();

		$('#divFormNsGrpCurrentGrp, #divNsGrpToDoDone')
			.hide()
	})

	//SELECCT HANDLERS
		//populate selects
			$('#slt_NsGrp_ward').mjm_addOptions('ward', {firstLine: 'All Wards', facility: user_facility, group: true});
			$('#slt_NsGrp_participate, #slt_NsGrp_respond, #slt_NsGrp_interact_leader, #slt_NsGrp_interact_peers, #slt_NsGrp_discussion_init').mjm_addOptions('NsNote1', {firstLine: 'choose'});
			$('#slt_NsGrp_discussion_understand').mjm_addOptions('NsNote2', {firstLine: 'choose'});
		//populate patient on ward change
		$('#slt_NsGrp_ward').change(function(e){
			var ward = $(this).val()
			popSelectWard(user_facility, ward)
		});
		//add selected patient to ns_groups_patients table
		$('#slt_NsGrp_patient').change(function(e){
			var patient_id = $(this).val();
			var ns_group_id = $('#nsGrp_ID').val();
			//Validation
			// Don't send request if at "ChoosePat"
			if (patient_id.length < 1) {
				return true;
				};
			popGroupPatientJoinTable(ns_group_id, patient_id)
		});

		//On choosing patient show form for note
		$('#slt_NsGrp_to_do, #slt_NsGrp_done').change(function(e){
			var patient_id_arrray = $(this).val();
			var patient_id = patient_id_arrray[0]
			var element_id = $(this).attr('id');
			var patientname = $('#'+element_id+' option:selected').text();

			

			//If to-do - display new form
			if (element_id == 'slt_NsGrp_to_do') {
				// Clear note, and hidden note_id, patient_id
				clearFields_note1();
				// Hide Group grid and Group Data if present
				$('#divSearchAndGrid, #divNsGrpNewEdit').hide();
				//remove selection from done select
				$('#slt_NsGrp_done').val('-1')
				// Set hiddent Patient_id texbox
				$('#ftx_Patient_id').val(patient_id);

				// Display new form
				$('#ftx_PatNote_display').val(patientname);
				$('#btNsGrpNoteSubmit').attr('value', 'New')
				$('#divNsGrpNotes').show();
				
				

			} else if (element_id == 'slt_NsGrp_done') {
				var group_date = $('#ftx_GrpDate_display')
				var ns_group_id = $('#nsGrp_ID').val();
				var group_date = $('#ftx_GrpDate_display').val();

				// Clear note, and hidden note_id, patient_id
					// Not really necessary as all field should be filled but clear anyway
				clearFields_note1();
				// Hide Group grid and Group Data if present
				$('#divSearchAndGrid, #divNsGrpNewEdit').hide();
				// Set hiddent Patient_id texbox
				$('#ftx_Patient_id').val(patient_id);

				//remove selection from to-do select
				$('#slt_NsGrp_to_do').val('-1')

				// Get note for this patient_id, group and date
				get_patient_note(patient_id, ns_group_id, group_date);
				
			};
		});

	//BUTTON HANDLERS
		//Submit complex search on fPatientSearch using hidden submit button
		$('#fNsGrpSearch').submit(function(e){
			e.preventDefault();
			complex_search_nsGrp();
		});
		//Show Facility in title
			// facility = $('#session-facility').val()
			// $('#txt-NsGrp-ShowFacility').val(facility)
		//Submit New/Edit information from input form fNsGrpNewEdit
		$('#fNsGrpNewEdit').submit(function(e){
			e.preventDefault();
			// VALIDATE that the form properly filled out
			validation_array = [
				['slt_NsGrp_duration','-1','Please choose Group Duration'],
				['txt_NsGrp_group_name','','Please enter Group Name'],
				['txt_NsGrp_leader','','Please enter Group Leader'],
				['txt_NsGrp_group_site','','Please enter Group Site']
			]

			//Loop through array and remove error messages if corrected
			remove_error_divs_if_corrected(validation_array)
 			//Loop through array and show error message if '', '-1' etc.
 			exit = validate_elements(validation_array)
 			if (exit) {return true};

 			//Get value of submit button to determine which AJAX call to make
			submit_value = $(this).find('input[type=submit]').attr('value')
			// alert(submit_value)
			switch(submit_value){
				case 'New':
					nsGrp_ajax1('/ns_groups/', 'POST');
					break;
				case 'Edit':
					ID = $('#nsGrp_ID').val();
					nsGrp_ajax1('/ns_groups/'+ID+'', 'PATCH');
					break;
				default:
					alert('submit_id not found');
					return false;
			};
		});

		//Close PatientData and clear fields
		$('#btNsGrpBack').click(function(){
			clearFields_patientData1();
			$('#divNsGrpNewEdit').hide();
		});

		// Remove patient from Group (to-do list)
		$('#bt_NsGrp_remove').click(function(e){
			var patient_id = $('#slt_NsGrp_to_do').val();
			var patient_text = $('#slt_NsGrp_to_do option:selected').text();
			var ns_group_id = $('#nsGrp_ID').val();
			// alert(patient_id)
			//Validation
			//Check that a patient is selected from todo list
				// N.B. 'patient_id' is an ARRAY, therefore in 'else' select value from array
				if (patient_id == null) {
					alert('Please select a patient from "To Do" list')
					return true;
				} else {
					patient_id = patient_id[0];
				};
			//Confirm want to delete
			var r = confirm('Are you sure you want to delete "'+patient_text+'"?' )
			if (r == true) {
				removePatient(ns_group_id, patient_id)
			} else{
				return true;
			};			
		});

		//Submit New/Edit information from input form fNsGrpNotes
		$('#fNsGrpNotes').submit(function(e){
			e.preventDefault();
			// VALIDATE that the form properly filled out
			validation_array = [
				['slt_NsGrp_participate','-1','Please choose "participation"'],
				['slt_NsGrp_respond','-1','Please choose "respond"'],
				['slt_NsGrp_interact_leader','-1','Please choose "Interact with Leader"'],
				['slt_NsGrp_interact_peers','-1','Please choose "Interact with Peers"'],
				['slt_NsGrp_discussion_init','-1','Please choose "initiates discussion"'],
				['slt_NsGrp_discussion_understand','-1','Please choose "understands discussion"'],			
				['txa_NsGrp_comment','','Please enter Comment']
			]

			//Loop through array and remove error messages if corrected
			remove_error_divs_if_corrected(validation_array)
 			//Loop through array and show error message if '', '-1' etc.
 			exit = validate_elements(validation_array)
 			if (exit) {return true};

 			//Get value of submit button to determine which AJAX call to make
			submit_value = $(this).find('input[type=submit]').attr('value')
			// alert(submit_value)
			switch(submit_value){
				case 'New':
					// rails convention 'create' route
					nsGrp_newedit_note('/ns_notes/', 'POST');
					break;
				case 'Edit':
					id = $('#ftx_Note_id').val();
					// rails convention 'update' route
					nsGrp_newedit_note('/ns_notes/'+id+'', 'PATCH')
					break;
				default:
					alert('submit_id not found');
					return false;
			};
		});

		//Close Notes and clear fields
		$('#btNsGrpNoteBack').click(function(e){
			//Clear notes and hide div remove todo done selections
			clear_notes_div_selections()
		});

		//Delete note
		$('#btNsGrpDelete').click(function(e){
			var ns_note_id = $('#ftx_Note_id').val();

			//Confirm that want to delete
			var r = confirm('Are you sure you want to delete this note?' )
			if (r == true) {
				deleteNote(ns_note_id)
			} else{
				return true;
			};	
		});

	// RUN ON OPENING
	complex_search_nsGrp()
}
})