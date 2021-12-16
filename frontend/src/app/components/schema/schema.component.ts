import { SchemaService } from './../../services/schema.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DtdServiceService } from './../../services/dtd-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.css']
})
export class SchemaComponent implements OnInit {

  isSubmited: boolean = false
  isValid: boolean = false
  errorMessage: string = ""
  state : boolean = false


  xsdFile: string = ""
  xmlFile: string =""

  xsd : string = ""
  xml : string = ""


  modalRefFile?: BsModalRef;

  modalRefXsd?: BsModalRef;
  modalRefXml?: BsModalRef;
  modalRefWrite?: BsModalRef;

  constructor(
    private toastr: ToastrService,
    private schemaService : SchemaService,
    private modalService: BsModalService,
    private stateService : StateService
  ) { }

  initState(){
    this.isSubmited = false,

    this.isValid = false
    this.errorMessage = ""
  }

  openModal(template: TemplateRef<any>) {
    //this.isSubmited = false
    this.stateService.changeSchemaState(true)
    this.state = this.stateService.getSchemaState()
    this.modalRefFile = this.modalService.show(template);
  }

  openModalXsd(template: TemplateRef<any>) {
    //this.isSubmited = false
    this.modalRefXsd = this.modalService.show(template);
  }

  openModalXml(template: TemplateRef<any>) {
    //this.isSubmited = false
    this.modalRefXml = this.modalService.show(template);
  }

  openModalWrite(template: TemplateRef<any>) {
    //this.isSubmited = false
    this.modalRefWrite = this.modalService.show(template);
  }

  ngOnInit(): void {
    this.initFileContent()
    this.initState()
    this.state = this.stateService.getDtdState()
  }

  onXsdSubmit(){
    this.modalRefXsd!.hide()
  }

  onXmlSubmit(){
    this.modalRefXml!.hide()
  }

  //-------------external validation--------------
  onSubmit(){
    this.isSubmited = true
    this.modalRefFile!.hide()
    this.schemaService.sendSchemaContent({xml : this.xmlFile,xsd : this.xsdFile}).subscribe(data => {
      console.log(data)
      this.isValid = data.isValid
      let msg = data.message.replace(/<string>:/i,'')+" ."
      msg = msg.replace(/:VALID:DTD_UNKNOWN_ELEM/i,'')
      msg = msg.replace(/[0-9]*[:][0-9]*[:]/i,'')
      this.errorMessage = msg
      if(this.isValid) this.toastr.success('Le contenu de votre document est valide.', 'Document Valide.');
    })
    this.initFileContent()
  }

  onSubmitWrite(){
    this.isSubmited = true
    this.modalRefWrite!.hide()
    this.schemaService.sendSchemaContent({xml : this.xml,xsd : this.xsd}).subscribe(data => {
      console.log(data)
      this.isValid = data.isValid
      let msg = data.message.replace(/<string>:/i,'')+" ."
      msg = msg.replace(/:VALID:DTD_UNKNOWN_ELEM/i,'')
      msg = msg.replace(/[0-9]*[:][0-9]*[:]/i,'')
      this.errorMessage = msg
      if(this.isValid) this.toastr.success('Le contenu de votre document est valide.', 'Document Valide.');
    })
  }

  xsdFileLoad(event : Event){
    let file = (<HTMLInputElement>event.target).files![0]
    let reader = new FileReader();
    reader.readAsText(file,'UTF-8')
    reader.onload = (e) => {
      this.xsdFile = e.target!.result!.toString()
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



  initFileContent(){
    this.xsdFile = ""
    this.xmlFile = ""
  }

  externalFormIsValid(){
    return this.xsdFile != "" && this.xmlFile != ""
  }

  choosendXml() : boolean {
    return  this.xmlFile != ""
  }

  choosendXsd() : boolean {
    return this.xsdFile != ""
  }

  xmlValid() : boolean{
    return this.xml.length >= 20
  }

  xsdValid() : boolean {
    return this.xsd.length >= 20
  }

  valid(){
    return this.xmlValid() && this.xsdValid()
  }

  renitialiser(event: Event){
    event.preventDefault()
    this.xsd  = ""
    this.xml  = ""
    this.isSubmited = false
    this.errorMessage = ''
    this.isValid = false
  }

}
