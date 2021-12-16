import { DtdServiceService } from './../../services/dtd-service.service';
import { StateService } from './../../services/state.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dtd',
  templateUrl: './dtd.component.html',
  styleUrls: ['./dtd.component.css']
})
export class DtdComponent implements OnInit {
  isSubmited: boolean = false
  state: boolean = true
  isValid: boolean = false
  errorMessage: string = ""

  dtdFile: string = ""
  xmlFile: string =""
  xmlInterneFile : string = ""


  modalRefDtdInterne?: BsModalRef;
  modalRefDtdExterne?: BsModalRef;
  modalRefDtdInternFile?: BsModalRef;

  internDtdForm = new FormGroup({
    content: new FormControl('',Validators.required),
  });


  constructor(
    public stateService: StateService,
    private toastr: ToastrService,
    private dtdService : DtdServiceService,
    private modalService: BsModalService
  ) { }

  initState(){
    this.isSubmited = false,
    this.state = true,
    this.isValid = false
    this.errorMessage = ""
  }

  openModaldtdInterneFile(template: TemplateRef<any>) {
    this.xmlInterneFile = ""
    this.modalRefDtdInternFile = this.modalService.show(template);
  }

  openModaldtdInterne(template: TemplateRef<any>) {
    //this.isSubmited = false
    this.modalRefDtdInterne = this.modalService.show(template);
  }

  openModaldtdExterne(template: TemplateRef<any>) {
    //this.isSubmited = false
    this.modalRefDtdExterne = this.modalService.show(template);
  }

  ngOnInit(): void {
    this.initFileContent()
    this.initState()
    this.state = this.stateService.getDtdState()
  }

  changeState(event: Event): void {
    event.preventDefault();
    this.isSubmited = false
    this.initFileContent()
    this.stateService.changeDtdState()
    this.initState()
    this.state = this.stateService.getDtdState()
  }

  onSubmitInternalValidation(){
    this.isSubmited = true
    let internalContent = this.internDtdForm.value['content']
    //console.log(internalContent)
    this.dtdService.sendDtdInternalContent(internalContent).subscribe(data => {
      console.log(data)
      this.isValid = data.isValid
      let msg = data.message.replace(/<string>:/i,'')+" ."
      msg = msg.replace(/:VALID:DTD_UNKNOWN_ELEM/i,'')
      msg = msg.replace(/[0-9]*[:][0-9]*[:]/i,'')
      this.errorMessage = msg
      if(this.isValid) this.toastr.success('Le contenu de votre document est valide.', 'Document Valide.');
    })
    this.modalRefDtdInterne!.hide()
    this.initFileContent()
  }

  //-------------external validation--------------
  onExternalSubmit(){
    this.isSubmited = true
    this.modalRefDtdExterne!.hide()
    this.dtdService.sendDtdExternalContent({xml : this.xmlFile,dtd : this.dtdFile}).subscribe(data => {
      this.isValid = data.isValid
      let msg = data.message.replace(/<string>:/i,'')+" ."
      msg = msg.replace(/:VALID:DTD_UNKNOWN_ELEM/i,'')
      msg = msg.replace(/[0-9]*[:][0-9]*[:]/i,'')
      this.errorMessage = msg
      if(this.isValid) this.toastr.success('Le contenu de votre document est valide.', 'Document Valide.');
    })
    this.initFileContent()
  }

  xmlInterneByFile(event : Event){
    let file = (<HTMLInputElement>event.target).files![0]
    let reader = new FileReader();
    reader.readAsText(file,'UTF-8')
    reader.onload = (e) => {
      this.xmlInterneFile = e.target!.result!.toString()
    }
  }

  isXmlInterneFileChoosen() : boolean {
    return this.xmlInterneFile != ""
  }

  onSubmitInternalFile(){
    this.isSubmited = true
    let internalContent = this.xmlInterneFile
    //console.log(internalContent)
    this.dtdService.sendDtdInternalContent(internalContent).subscribe(data => {
      console.log(data)
      this.isValid = data.isValid
      let msg = data.message.replace(/<string>:/i,'')+" ."
      msg = msg.replace(/:VALID:DTD_UNKNOWN_ELEM/i,'')
      msg = msg.replace(/[0-9]*[:][0-9]*[:]/i,'')
      this.errorMessage = msg
      if(this.isValid) this.toastr.success('Le contenu de votre document est valide.', 'Document Valide.');
    })
    this.modalRefDtdInternFile!.hide()
    //this.initFileContent()
  }

  dtdFileLoad(event : Event){
    let file = (<HTMLInputElement>event.target).files![0]
    let reader = new FileReader();
    reader.readAsText(file,'UTF-8')
    reader.onload = (e) => {
      this.dtdFile = e.target!.result!.toString()
    }
  }

  xmlFileLoad(event : Event){
    let file = (<HTMLInputElement>event.target).files![0]
    let reader = new FileReader();
    reader.readAsText(file,'UTF-8')
    reader.onload = (e) => {
      this.xmlFile = e.target!.result!.toString()
    }
  }

  externalFormIsValid(){
    return this.dtdFile != "" && this.xmlFile != ""
  }

  initFileContent(){
    this.dtdFile = ""
    this.xmlFile = ""
  }

}
