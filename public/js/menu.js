'use strict';
//Onload get categories
window.addEventListener('load', () => {
	httpGet('/api/get-categories', (categories) => {
		if(categories && categories != '' && categories != undefined){
			categories = JSON.parse(categories);
			categories = categories.arrayCategorias;
			let htmlCategories = '';
			for(let i = 0; i < categories.length; i++){
				if(i == 0){
					htmlCategories += `<li onmouseenter="cambiarColorFlechaDepartamentos()"
						onmouseleave="cambiarColorFlechaDepartamentos()">
						<a href="/d/${categories[i]}">
						${categories[i]}</a>
					</li>`;
				}else{
					htmlCategories += `<li >
						<a href="/d/${categories[i]}">
						${categories[i]}</a>
					</li>`;
				}
			}
			//Seleccionamos el 2º child porque el texto indentado se considera como un child
			q('#expandible-departamentos').children[0].insertAdjacentHTML('beforeend', htmlCategories);
			q('footer .departamentos').innerHTML = htmlCategories; //Footer			
		}
	});
	if(getParameterByName('searched')){
		httpPost('/api/guardar-busqueda', getParameterByName('searched'));
	}
});

window.addEventListener('resize', acortarTextoResultadosBusqueda);

//Para ocultar o mostrar el menu de departamentos para ir a uno determinado
function ocultarMostrarDepartamentos(isDepartamentosActive){
	//En pantallas pequeñas poner el dropdown dentro del menu
	if(window.innerWidth >= 650){
		if(isDepartamentosActive) q('#expandible-departamentos').className = 'animar-mostrar-departamentos';
		else q('#expandible-departamentos').className = '';
	}else{
		if(isDepartamentosActive) q('#expandible-departamentos').className = 'animar-mostrar-departamentos-responsive';
		else q('#expandible-departamentos').className = '';
	}
};

//Para buscar productos y mostrar palabras sugeridas
function buscarProducto(keyword){
	if(keyword.length >= 3){
		keyword = encodeURIComponent(keyword);
		httpGet(`/api/search/${keyword}`, results => {
			try{
				results = JSON.parse(results);
			}catch(e){
				results = null;
			}
			q('#buscador-sugerencias').firstChild.innerHTML = '';
			if(results != null && results != undefined){
				q('#buscador-sugerencias').children[0].innerHTML = generarResultadosBusquedaHTML(results);
				acortarTextoResultadosBusqueda();
			}else{
				//Si no hay resultados, ocultar la barra de results
				q('#buscador-sugerencias').style.display = 'none';
			}
		});
	}else{
		q('#buscador-sugerencias').style.display = 'none';
	}
};

function generarResultadosBusquedaHTML(results){
	q('#buscador-sugerencias').style.display = 'block';
	//Show suggested searches or products
	let htmlProducto = "";
	for(let i = 0; i < results.length; i++){
		htmlProducto += 
		`<tr>
			<td><img class="thumbnail" src="../../public-uploads/${results[i].imagenes[1]}"/></td>
			<td>
			<a class="texto-item-busqueda" title="${results[i].titulo}" 
			href="/p/${results[i].permalink}?searched=${encodeURIComponent(q('#buscador').value)}">
			${results[i].titulo}</a></td>
		</tr>`;
	}
	return htmlProducto;
};
//Comprobamos el tamaño de la pantalla para hacer responsive los resultados de busqueda
function acortarTextoResultadosBusqueda(){
	if(window.innerWidth <= 800 && (window.innerWidth >= 650 || window.innerWidth <= 400)){
		qAll('.texto-item-busqueda').forEach((e) => {
			e.innerHTML = e.innerHTML.substring(0, 30) + '...';
		});
	}
}

let flechaActiva = false;
function cambiarColorFlechaDepartamentos(){
	if(!flechaActiva){
		if(q('#triangulo-up-sesion')){
			if((window.outerWidth-16) <= 1000 && (window.outerWidth-16) >= 650) q('#triangulo-up-sesion').style.borderBottomColor = '#74b1ff';
			else q('#triangulo-up-sesion').style.borderBottomColor = '#91c1ff';
		}
		if(q('#flecha-departamentos')) q('#flecha-departamentos').style.borderBottomColor = '#91c1ff';
		flechaActiva = true;
	}else{
		if(q('#triangulo-up-sesion')) q('#triangulo-up-sesion').style.borderBottomColor = 'white';
		if(q('#flecha-departamentos')) q('#flecha-departamentos').style.borderBottomColor = 'white';
		flechaActiva = false;
	}
};
function ocultarCestaBuscadorHoverDropdown(ocultarCesta){
	if(q('#productos-cesta') && (ocultarCesta == undefined || ocultarCesta == null)){
		q('#productos-cesta').style.display = 'none';
		q('span.triangulo-up').style.display = 'none';
	}
	if(q('#buscador-sugerencias')){
		q('#buscador-sugerencias').style.display = 'none';
	}
}
//Ajusta el diseño del menú onscroll
function reducirMenuScroll(){
	if(document.body.scrollTop >= 25 && window.innerWidth > 650){
		qAll('.subtitulos-menu').forEach(e => {
			e.style.display = 'none';
		});
		q('#menu-principal').style.height = '55px';
		q('#menu-principal').style.position = 'fixed';
		//Seleccionamos el elemento debajo del menú inferior
		q('#sustituto-menu-fixed').style.display = 'block';
		q('#productos-cesta').style.top = '63px';
	}else if(window.innerWidth > 650){
		qAll('.subtitulos-menu').forEach(e => {
			e.style.display = 'inline';
		});
		q('#menu-principal').style.height = '70px';
		q('#menu-principal').style.position = 'relative';
		q('#sustituto-menu-fixed').style.display = 'none';
		q('#productos-cesta').style.top = '70px';
	}else if(window.innerWidth < 650){
		q('#menu-principal').style.height = '100%';
		q('#menu-principal').style.position = 'relative';
		q('#sustituto-menu-fixed').style.display = 'none';
	}
};
//Oculta o muestra el buscador
function ocultarMostrarBuscadorResponsive(mostrar){
	//En pantallas pequeñas ocultar el buscador al click fuera
	if(window.innerWidth <= 650){
		if(mostrar){
			qAll('#contenedor-login-dropdown, #cesta, #departamentos').forEach(e => {
				e.style.display = 'none';
			});
			q('#buscador').style.display = 'block';
			q('#contenedor-buscador').style.width = '100%';
		}else{
			qAll('#contenedor-login-dropdown, #cesta, #departamentos').forEach(e => {
				e.style.display = 'flex';
			});
			q('#buscador').style.display = 'none';
			q('#contenedor-buscador').style.width = '70px';
		}
	}else{
		qAll('#contenedor-login-dropdown, #cesta, #departamentos').forEach(e => {
			e.style.display = 'flex';
		});
		q('#buscador').style.display = 'block';
		q('#contenedor-buscador').style.width = '';
	}
};

window.addEventListener('scroll', reducirMenuScroll);

/*

CESTA (LO IMPORTANTE ESTÁ EN CESTA.JS) Para ocultar el buscador al hover cesta

*/
q('a#cesta').addEventListener('mouseenter', () => {
	ocultarCestaBuscadorHoverDropdown(false);
});

/*

DEPARTAMENTOS

*/
//Ocultar o mostrar el menu de departamentos
q('#departamentos').addEventListener('mouseenter', () => {
	ocultarCestaBuscadorHoverDropdown();
	ocultarMostrarDepartamentos(true);
});
q('#departamentos').addEventListener('mouseleave', () => {
	ocultarMostrarDepartamentos(false);
});
/*

BUSCADOR

*/
//Para buscar sugerencias a cada toque
q('#buscador').addEventListener('keyup', () => {
	if(window.innerWidth > 650) buscarProducto(q('#buscador').value);
});
//Al hacer focus al input
q('#buscador').addEventListener('focus', () => {
	if(window.innerWidth > 650){
		buscarProducto(q('#buscador').value);
		ocultarCestaBuscadorHoverDropdown();
	}
});
q('#buscador').addEventListener('click', (e) => {
	if(window.innerWidth > 650){
		buscarProducto(q('#buscador').value);
		ocultarCestaBuscadorHoverDropdown();
		e.stopPropagation();
	}
});
q('#buscador').addEventListener('keypress', (e) => {
	if(e.keyCode == 13 && q('#buscador').value != null && q('#buscador').value != "" && q('#buscador').value != undefined){
		window.location.href = `/search?q=${encodeURI(q('#buscador').value)}`;
	}
});
//Para ir a la página de busqueda
q('#icono-busqueda').addEventListener('click', (e) => {
	//Si la busqueda no esta vacía, redirigir a resultados de busqueda en caso de hacer click a buscar
	if(q('#buscador').value != null && q('#buscador').value != "" && q('#buscador').value != undefined){
		window.location.href = `/search?q=${encodeURI(q('#buscador').value)}`;
	}
	ocultarMostrarBuscadorResponsive(true);
	e.stopPropagation();
});
q('#icono-busqueda').addEventListener('mouseover', (e) => {
	ocultarMostrarBuscadorResponsive(true);
	e.stopPropagation();
});
q('html').addEventListener('click', (e) => {
	q('#buscador-sugerencias').style.display = 'none';
	if(!q('#menu-principal').contains(e.target))
		ocultarMostrarBuscadorResponsive(false);
});
/*

SESIÓN

*/
//Para mostrar el desplegable de opciones de sesion al hover sesion
q('#contenedor-login-dropdown').addEventListener('mouseenter', () => {
	if(q('a#usuario').getAttribute('href') != '/login'){
		ocultarCestaBuscadorHoverDropdown();
		q('#triangulo-up-sesion').style.display = 'block';
		q('#menu-sesion').style.display = 'block';
	}
});
q('#contenedor-login-dropdown').addEventListener('mouseleave', () => {
	q('#triangulo-up-sesion').style.display = 'none';
	q('#menu-sesion').style.display = 'none';
});