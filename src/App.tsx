import { BaseSyntheticEvent, useMemo, useState } from "react";
import {useTable} from "react-table";
import { COLUNAS } from "./colunas";
import "./app.css"


export default function App() {
  const [dados, setDados] = useState<any[]>([])
  const [sexo, setSexo] = useState("masc")
  const [nome, setNome] = useState("")
  const [matricula, setMatricula] = useState("")
  const [idade, setIdade] = useState("")
  const [barras, setBarras] = useState("")
  const [pontosbarras, setPontosbarras] = useState("")
  const [flexoes, setFlexoes] = useState("")
  const [pontosflexoes, setPontosflexoes] = useState("")
  const [abdominais, setAbdominais] = useState("")
  const [pontosabdominais, setPontosabdominais] = useState("")
  const [metragemcorrida, setMetragemcorrida] = useState("")
  const [pontoscorrida, setPontoscorrida] = useState("")
  const [totalpontos, setTotalpontos] = useState("")
  const [parecer, setParecer] = useState("INAPTO")
  
  function clearForm(){
    setSexo("masc")
    setNome("")
    setMatricula("")
    setIdade("")
    setBarras("")
    setPontosbarras("")
    setFlexoes("")
    setPontosflexoes("")
    setAbdominais("")
    setPontosabdominais("")
    setMetragemcorrida("")
    setPontoscorrida("")
    setTotalpontos("")
    setParecer("INAPTO")
  }

  function distribuicaoMasculina(idade: number){
    var pontos = 10.0;
    if(idade<26) pontos+=0; else 
    if(idade>25 && idade<31) pontos+=1;else
    if(idade>30 && idade<36) pontos+=2;else
    if(idade>35 && idade<41) pontos+=4;else
    if(idade>40 && idade<46) pontos+=5;else
    if(idade>45 && idade<51) pontos+=7;else
    if(idade>50) pontos+=8;
    return pontos;
}
function distribuicaoFeminina(idade: number){
    var pontos = 10.0;
    if(idade<26) pontos+=0; else 
    if(idade>25 && idade<31) pontos+=0.5;else
    if(idade>30 && idade<36) pontos+=1;else
    if(idade>35 && idade<41) pontos+=2;else
    if(idade>40 && idade<46) pontos+=3;else
    if(idade>45 && idade<51) pontos+=5;else
    if(idade>50) pontos+=6;
    return pontos;
}
function calculaCorridaMasculina(quantidade: number, idade: number){
    if(quantidade>2800) return 10;
    if(quantidade<1000) return 0;
    //36 linhas na tabela, 36 índices no vetor
    var mapQuantidade = new Map();
    var pontos = distribuicaoMasculina(idade);
    for (let index = 2800; index > 999; index=index-50) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        pontos-=0.5;
        if(pontos<1) pontos =0;
    }
    //Math.floor arredonda pra baixo. Como eu quero múltiplos de 50, eu arredondo a divisão, depois multiplico de novo por 50
    //por exemplo: 125/50 dá 2,5.... com o math.floor, isso vira 2. Multiplicando por 50 tenho 100, que é o arredondamento pra baixo (floor) múltiplo de 50
    return mapQuantidade.get(Math.floor(quantidade/50)*50);
}


function calculaCorridaFeminina(quantidade: number, idade: number){
    if(quantidade>2200) return 10;
    if(quantidade<700) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoFeminina(idade);
    for (let index = 2200; index > 699; index=index-50) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        pontos-=0.5;
        if(pontos<1) pontos =0;
    }    
    return mapQuantidade.get(Math.floor(quantidade/50)*50);
}


function calculaFlexaoMasculina(quantidade: number, idade: number){
    if(quantidade>27) return 10;
    if(quantidade<1) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoMasculina(idade);
    for (let index = 27; index >= 0; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else{mapQuantidade.set(index, pontos);}
        pontos-=0.5;
        if(pontos<1) pontos =0;
    }
    return mapQuantidade.get(quantidade);
}


function calculaFlexaoFeminina(quantidade: number, idade: number){
    if(quantidade>24) return 10;
    if(quantidade<1) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoFeminina(idade);
    for (let index = 24; index >= 0; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else{mapQuantidade.set(index, pontos);}
        pontos-=0.5;
        if(pontos<1) pontos =0;
    }    
    return mapQuantidade.get(quantidade);
}


function calculaBarras(quantidade: number, idade: number): number{
    if(quantidade>12) return 10;
    if(quantidade<1) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoMasculina(idade);
    for (let index = 12; index >= 0; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else{mapQuantidade.set(index, pontos);}
        pontos-=0.5;
        if(pontos<1) pontos =0;
    }    
    return mapQuantidade.get(quantidade);
}


function calculaAbdominalMasculino(quantidade: number, idade: number){
    if(quantidade>49) return 10;
    if(quantidade<1) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoMasculina(idade);
    for (let index=49; index >=47; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        pontos-=0.5;
    }
    for (let index = 46; index > 30; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        if(index%2!=0) pontos-=0.5; //se index é ímpar, aí decrementa
    }    
    if(pontos>=10){
        mapQuantidade.set(30, 10);
        mapQuantidade.set(29, 10);
    } else{
        mapQuantidade.set(30, pontos);
        mapQuantidade.set(29, pontos);}

    for (let index = 28; index >= 20; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        if(index%2==0) pontos-=0.5; //se index é par, aí decrementa
    }
    for(let index=19; index>0; index--){
        if(pontos>10){mapQuantidade.set(index, 10);}else 
        if(pontos<1){mapQuantidade.set(index, 0);}else 
        {mapQuantidade.set(index, pontos);}
        pontos-=0.5; 
    }
    return mapQuantidade.get(quantidade);
}


function calculaAbdominalFeminino(quantidade: number, idade: number){
    if(quantidade>38) return 10;
    if(quantidade<1) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoFeminina(idade);
    for (let index=38; index >=36; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        pontos-=0.5;
    }
    for (let index = 35; index > 30; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        if(index==34) pontos-=0.5;
    }

    for (let index = 30; index >= 26; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        if(index%2==0) pontos-=0.5; //se index é par, aí decrementa
    }
    for(let index=25; index>=3; index--){
        if(pontos>10){mapQuantidade.set(index, 10);}else 
        if(pontos<1){mapQuantidade.set(index, 0);}else
        {mapQuantidade.set(index, pontos);}
        pontos-=0.5; 
    }
    for(let index=2; index>=0; index--){
        if(pontos>10){mapQuantidade.set(index, 10);}else 
        if(pontos<1){mapQuantidade.set(index, 0);}else
        {mapQuantidade.set(index, pontos);}
    }    
    return mapQuantidade.get(quantidade);
}

  function handleSexoChange(e: BaseSyntheticEvent){
    setSexo(e.target.value)
  }

  function handleNomeChange(e: BaseSyntheticEvent){
    setNome(e.target.value)
  }

  function handleMatriculaChange(e: BaseSyntheticEvent){
    setMatricula(e.target.value)
  }

  function handleIdadeChange(e: BaseSyntheticEvent){
    setIdade(e.target.value)
  }

  function calculaTotal(){
    let soma = parseFloat(pontosabdominais) + parseFloat(pontosbarras) + parseFloat(pontoscorrida) + parseFloat(pontosflexoes)
    let resultado = soma/3
    resultado = parseFloat(resultado.toFixed(2));
    setTotalpontos(resultado.toString());
    if(resultado>=7) setParecer("APTO")
    else if(resultado<7) setParecer("INAPTO")
  }

  function handleBarrasChange(e: BaseSyntheticEvent){
    let barras = e.target.value as string;
    setBarras(barras);
    if(parseInt(barras)>0){
      setFlexoes("0")
      setPontosflexoes("0")
    }
    let ptsbarras =  calculaBarras(parseInt(barras), parseInt(idade))
    setPontosbarras(ptsbarras.toString())
  }

  function handleFlexoesChange(e: BaseSyntheticEvent){
    let flex = e.target.value as string;
    setFlexoes(flex)
    if(parseInt(flex)>0) {
      setBarras("0")
      setPontosbarras("0")
    }
    let ptsflexoes = 0;
    if(sexo==="masc") ptsflexoes = calculaFlexaoMasculina(parseInt(flex),parseInt(idade))
    else if(sexo==="fem") ptsflexoes = calculaFlexaoFeminina(parseInt(flex),parseInt(idade))
    setPontosflexoes(ptsflexoes.toString());
  }

  function handleAbdominaisChange(e: BaseSyntheticEvent){
    let abdominais = e.target.value as string;
    setAbdominais(abdominais)
    let ptsabdominais = 0;
    if(sexo==="masc") ptsabdominais = calculaAbdominalMasculino(parseInt(abdominais),parseInt(idade))
    else if(sexo==="fem") ptsabdominais = calculaAbdominalFeminino(parseInt(abdominais),parseInt(idade))
    setPontosabdominais(ptsabdominais.toString())
  }

  function handleCorridaChange(e: BaseSyntheticEvent){
    let metros = e.target.value as string;
    setMetragemcorrida(metros)
    let ptscorrida = 0;
    if(sexo==="masc") ptscorrida = calculaCorridaMasculina(parseInt(metros),parseInt(idade))
    else if(sexo==="fem") ptscorrida = calculaCorridaFeminina(parseInt(metros),parseInt(idade))
    setPontoscorrida(ptscorrida.toString())
  }

  function handleForm(e: BaseSyntheticEvent){
    console.log("Entrou no handleForm")
    e.preventDefault();
    setDados((oldValue)=>{
      return [...oldValue, {nome, matricula, idade, barras, pontosbarras, flexoes, pontosflexoes, abdominais, pontosabdominais, metragemcorrida, pontoscorrida, totalpontos, parecer}]
    })
    clearForm();
  }

  const colunas = useMemo(()=> COLUNAS, []);
  const table_instance = useTable({columns: colunas, data: dados})
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = table_instance
  return (
    <>
      <h1>Calculadora TAF</h1>
      <form id="formulario" onSubmit={handleForm}>
        <input type="radio" name="sexoInput" id="masc" value="masc" required checked={sexo==="masc"} onChange={handleSexoChange}/>
        <label htmlFor="masc">Masc</label>
        <input type="radio" name="sexoInput" id="fem" value="fem" checked={sexo==="fem"} onChange={handleSexoChange}/>
        <label htmlFor="fem">Fem</label>
        <br />
        <label htmlFor="nomeInput">Nome: </label>
        <input type="text" name="nomeInput" id="nomeInput" onChange={handleNomeChange} value={nome}/> <br />
        <label htmlFor="matriculaInput">Matrícula: </label> 
        <input type="number" name="matriculaInput" id="matriculaInput" min={1000} onChange={handleMatriculaChange} value={matricula}/> <br />
        <label htmlFor="idadeInput">Idade: </label>
        <input type="number" name="idadeInput" id="idadeInput" min={18} onChange={handleIdadeChange} value={idade}/> <br />
        <label htmlFor="barrasInput">Barras: </label>
        <input type="number" name="barrasInput" id="barrasInput" min={0} max={30} onChange={handleBarrasChange} value={barras} />
        <span style={{color: "grey"}}>Pontos: <input tabIndex={-1} readOnly value={pontosbarras} type="number" name="pontosbarrasInput" id="pontosbarrasInput"/></span> <br />
        <label htmlFor="flexoesInput">Flexões: </label>
        <input type="number" name="flexoesInput" id="flexoesInput" min={0} max={90} onChange={handleFlexoesChange} value={flexoes} />
        <span style={{color: "grey"}}>Pontos: <input tabIndex={-1} readOnly value={pontosflexoes} type="number" name="pontosflexoesInput" id="pontosflexoesInput"/></span> <br />
        <label htmlFor="abdominaisInput">Abdominais: </label>
        <input type="number" name="abdominaisInput" id="abdominaisInput" min={0} max={80} onChange={handleAbdominaisChange} value={abdominais} />
        <span style={{color: "grey"}}>Pontos: <input tabIndex={-1} readOnly value={pontosabdominais} type="number" name="pontosabdominaisInput" id="pontosabdominaisInput"/></span> <br />
        <label htmlFor="corridaInput">Metragem na corrida: </label>
        <input type="number" name="corridaInput" id="corridaInput" min={0} max={3600} onChange={handleCorridaChange} value={metragemcorrida} />
        <span style={{color: "grey"}}>Pontos: <input tabIndex={-1} readOnly value={pontoscorrida} type="number" name="pontoscorridaInput" id="pontoscorridaInput"/></span> <br />
        <br />
        <button type="button" onClick={calculaTotal}>Calcular</button>
        <br /> <br /> <br />
        Total: <span id="spantotal">{totalpontos}</span> <br />
        Parecer: <span id="spanparecer" style={{color: parecer==="INAPTO"?"red":"green"}}>{parecer}</span>
        <br />
        <input type="submit" value="Gravar dados" />
      </form>
      <div>
      <table id="tabela_taf" {...getTableProps()}>
            <thead>
                {headerGroups.map(headergroup => {
                    return <tr {...headergroup.getHeaderGroupProps()}>
                        {headergroup.headers.map(column => {
                            return <th {...column.getHeaderProps()}>
                                {column.render("Header")}
                            </th>
                        })}
                    </tr>
                })}

            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <>
                                <td {...cell.getCellProps()}>
                                    {cell.render("Cell")}
                                </td>
                            </>
                        })}
                    </tr>
                })}

            </tbody>
        </table>
      </div>
    </>
  )
}

