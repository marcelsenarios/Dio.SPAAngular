import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransacoesService } from 'src/app/pages/transacoes.service';
import { Transacoes } from '../../model/transacoes';


interface Classificacao {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'luiz-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {

  acerto = {} as Transacoes;
  valor=0.0; 
  constructor(private transacoesService: TransacoesService,
              private formBuilder: FormBuilder) 
  {
  }

  public AdicionarTransacao = new FormGroup({
    nome: new FormControl('', [ Validators.required,]),
    valorTransacao: new FormControl('', [ Validators.required,]),
    dataTransacao: new FormControl('', [ Validators.required,]),
    classificacaoTransacao: new FormControl('', [ Validators.required,]),
  });

  Varia(ent){
    this.valor+= parseFloat(ent);
    this.AdicionarTransacao.get('valorTransacao').setValue(this.valor.toFixed(2).toString());
  }

  onSubmit(valorSubmetido) {

    let dia =  valorSubmetido.dataTransacao.getDate();
    let mes = valorSubmetido.dataTransacao.getMonth()+1;
    let ano= valorSubmetido.dataTransacao.getYear()+1900;

    this.acerto.diaTransacao= dia; 
    this.acerto.mesTransacao= mes; 
    this.acerto.anoTransacao= ano; 
    this.acerto.classificacaoTransacao= valorSubmetido.classificacaoTransacao; 
    this.acerto.nome = valorSubmetido.nome; 
    this.acerto.valorTransacao= parseFloat(valorSubmetido.valorTransacao); 

    this.transacoesService.postTransacao(this.acerto).subscribe((users) => {
      this.acerto = users;
    });

    // this.checkoutForm.reset();
    alert("Transação de R$ " + this.acerto["valorTransacao"] + " criada");
    console.warn('Your order has been submitted', valorSubmetido);
  }

  
  public OnDateChange(event: any): void {
    
    let dia =  event.getDate();
    let mes = event.getMonth()+1;
    let ano= event.getYear()+1900;
    var dateFrom = `${dia}/${mes}/${ano}`;
    //console.log(dateFrom);
  }

  
}



  // classificacoes: Classificacao[] = [
  //   {value: 'alimentacao', viewValue: 'Alimentação'},
  //   {value: 'educacao', viewValue: 'Educação'},
  //   {value: 'transporte', viewValue: 'Transporte'},
  //   {value: 'salario', viewValue: 'Salário'},
  //   {value: 'trabalhoextra', viewValue: 'Trabalhos Extras'},
  // ];


  //    var dateFrom = `${dia}/${mes}/${ano}`;

    // console.log(valorSubmetido.ID);
    // console.log(valorSubmetido.classificacaoTransacao);
    // console.log(valorSubmetido.nome);
    // console.log(valorSubmetido.valorTransacao);

     //this.acerto.ID = parseInt(valorSubmetido.ID);
