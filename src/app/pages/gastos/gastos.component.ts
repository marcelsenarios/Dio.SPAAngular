import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Transacoes } from 'src/app/model/transacoes';
import { TransacoesService } from 'src/app/pages/transacoes.service';

@Component({
  selector: 'luiz-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit {


displayedColumns: string[] = ['nome', 'valorTransacao',
  'diaTransacao', 'mesTransacao', 'anoTransacao', 'classificacaoTransacao', 'actions'];

transacoes: any = []; /// todas as transacoes do banco 
transacoesFiltrada: Transacoes[]; /// transacoes na tabela 
single = [];
show = false;

  rangeFormGroup = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required)
  })

  constructor(private transacoesService: TransacoesService) { 
    this.transacoesService.getTransacoesHTTP().
    subscribe((transacoes) => {
      this.transacoes = transacoes;
    });
  }


  ngOnInit(): void {
 
  }

  Remover(transacao: Transacoes) {
    
    this.transacoesFiltrada = this.transacoesFiltrada.filter( item => {
      if (
        (item.nome === transacao.nome) &&  
        (item.anoTransacao === transacao.anoTransacao) &&  
        (item.classificacaoTransacao === transacao.classificacaoTransacao) &&  
        (item.diaTransacao === transacao.diaTransacao) &&  
        (item.mesTransacao === transacao.mesTransacao) &&  
        (item.anoTransacao === transacao.anoTransacao) &&  
        (item.valorTransacao === transacao.valorTransacao)  
      ){
       
       // console.log(item.id);
        this.transacoesService.removeTransacaoHTTP(item.id); /// faz a request para remover do banco 
        this.transacoesService.removeTransacaoHTTP(item.id) /// recebe o retorno e guarda em transacoes 
          .subscribe(transacoes => {
            this.transacoes = transacoes;
            //this.dataSource = this.transacoes; /// preenche a tabela com todas as transações 
          });
        return false;
      }
      else 
      {
        return true ;
      }
       
    });

    // console.log(this.transacoesFiltrada);
    // this.atualizaTabela();
    // this.atualizaGrafico();
   
     
     // this.filtrar();
  }

  atualizaTabela(){

          /// pegando a data para filtrar 
          let dia = this.rangeFormGroup.value.start.getDate();
          let mes = this.rangeFormGroup.value.start.getMonth() + 1;
          let ano = this.rangeFormGroup.value.start.getYear() + 1900;
          var dateFrom = `${dia}/${mes}/${ano}`;
      
          dia = this.rangeFormGroup.value.end.getDate();
          mes = this.rangeFormGroup.value.end.getMonth() + 1;
          ano = this.rangeFormGroup.value.end.getYear() + 1900;
          var dateTo = `${dia}/${mes}/${ano}`;
      
          var d1 = dateFrom.split("/");
          var d2 = dateTo.split("/");
      
          var from = new Date(parseInt(d1[2]), parseInt(d1[1]) - 1, parseInt(d1[0]));  // -1 because months are from 0 to 11
          var to = new Date(parseInt(d2[2]), parseInt(d2[1]) - 1, parseInt(d2[0]));
      
      
          /// popula o vetor transacoes Filtrada alterando assim a tablea 
          this.transacoesFiltrada = this.transacoes.filter(item => {
            dia = item.diaTransacao;
            mes = item.mesTransacao;
            ano = item.anoTransacao;
            var dateCheck = `${dia}/${mes}/${ano}`;
            var c = dateCheck.split("/");
            var check = new Date(parseInt(c[2]), parseInt(c[1]) - 1, parseInt(c[0]));
            return (this.dentroDoIntervalo(from, to, check))
          }
          );

  }
  
  atualizaGrafico(){
    //// agrupa as transacoes filtradas para que possa atualizar o grafico (single)
    let agrupamento =
      this.transacoesFiltrada.map(datum => ({
        name: datum.mesTransacao.toString() + '/' + datum.anoTransacao.toString(),
        value: datum.valorTransacao
      }));

    let objTotalPorData = this.agruparPor(agrupamento, 'name', 'value');
    let vecTotalPorData = [];
    let obj = {};

    for (var mesAno in objTotalPorData) {
      obj = {
        name: mesAno,
        value: objTotalPorData[mesAno],
      }
      vecTotalPorData.push(obj);
    }

    /// altera o gráfico 
    this.single =
      vecTotalPorData.map(datum => ({
        name: datum.name,
        value: datum.value
      }));
  }


  dentroDoIntervalo(from, to, check) {
    return ((check >= from && check <= to))
  }

  agruparPor(objetoArray, prop1, prop2) {
    return objetoArray.reduce(function (acc, obj) {
      let key = obj[prop1]; /// key = "10/2020"
      let value = obj[prop2]; /// value = -1000
      if (!acc[key]) { /// se nao existir , cria 
        acc[key] = [];  /// cria vazio 
        acc[key] = parseFloat(value);   /// pusha o objeto inteiro da primeira vez 
      } else
        acc[key] += parseFloat(value);   /// na segunda eu quero que ele pegue o valor existente e some com o que está vindo 
      return acc;
    }, {});
  }


  filtrar() {
     this.atualizaTabela();
     this.atualizaGrafico();
  }



}


 // let reduceMesAno = this.transacoesFiltrada.reduce();
     /// atualiza o grafico 
     //console.log(this.transacoesFiltrada);
     ///vetor mes ano 


// filtrando a tabela 
    // this.dataSource = this.dataSource.filter(item => 
    //   item.classificacaoTransacao !== 'transporte');

    // this.dataSource = this.dataSource.filter(item => 
    //   item);    



// console.log(this.rangeFormGroup.value.start.getDate());
// console.log(this.rangeFormGroup.value.start.getMonth()+1);
// console.log(this.rangeFormGroup.value.start.getYear()+1900);



// console.log(this.rangeFormGroup.value.end.getDate());
// console.log(this.rangeFormGroup.value.end.getMonth()+1);
// console.log(this.rangeFormGroup.value.end.getYear()+1900);


 //   this.dataSource.forEach(item => {
    //   dia =  item.diaTransacao;
    //   mes = item.mesTransacao;
    //   ano= item.anoTransacao;
    //   var dateCheck = `${dia}/${mes}/${ano}`;
    //   var c = dateCheck.split("/");
    //   var check = new Date(parseInt(c[2]), parseInt(c[1])-1, parseInt(c[0]));
    //   if(this.dentroDoIntervalo(from,to,check) )
    //     this.transacoesFiltrada.push(tra);
    // });


//dataSource: Transacoes[]; //// todas as transicoes 
//transacoes$: Observable<Transacoes[]>;



// single = [
//   {
//     "name": "Luiz",
//     "value": 8940000
//   },
//   {
//     "name": "USdadasA",
//     "value": 5000000
//   },
//   {
//     "name": "Franfdfdce",
//     "value": 7200000
//   }
// ];



    // console.log(this.rangeFormGroup.value.start.getDay());
    // console.log(this.rangeFormGroup.value.start.getMonth());
    // console.log(this.rangeFormGroup.value.start.getFullYear());

    // console.log(this.rangeFormGroup.value.end.getDay());
    // console.log(this.rangeFormGroup.value.end.getMonth());
    // console.log(this.rangeFormGroup.value.end.getFullYear());

    // console.log(this.rangeFormGroup.value);





    // this.transacoesService.getTransacoesObservable("Luiz"); /// faz a request 
    // this.transacoesService.getTransacoesObservable("Luiz")
    //   .subscribe(transacoes => 
    //     {
    //     this.transacoes$ = transacoes;
    //     console.log(this.transacoes); /// so depois do subscribe que terei acesso as informaç~les 

    //   });


       /// pego todas as minhas transacoes do dataSource e aloco em transacoes
    // this.transacoesService.getTransacoes("Luiz"); /// faz a request 
    // this.transacoesService.getTransacoes("Luiz")
    //   .subscribe(transacoes => {
    //     this.transacoes = transacoes;
    //     //this.dataSource = this.transacoes;
    //   });

     
     
