/*	chjsobjects - v0.0.1 - 2013-04-16
* 	twitter @ochand
*	include: jsTable
* 	copyright (c) 2013 ICRONOK http://icronok.com/ */

var jsTable = {

	header: 				new Array(),
	body: 				new Array(),
	footer:				new Array(),
	rows:					0,
	columns:				0,

	init: function(jsonData, bodyStyle, bodyLink, footerFoo, footerStyle) {
		try {
			this.initHeader(jsonData[0]);
			this.initBody(jsonData, jsonData[0], bodyStyle, bodyLink);
			this.initFooter(jsonData, footerFoo, bodyStyle, footerStyle);			
		}
		catch (e) {
			this.logError(e);
		}		
	},

	initHeader: function(json0) {		
		try {
			var header = new Array();
			$.each(json0, function(i, value) {
				if ( i.substring(0,1)!='_' )
					colsLength = header.push(i);
			});
			this.header = header;			
			this.columns = colsLength;
		}
		catch (e) {
			this.logError(e);
		}
	},	
	
	initBody: function(jsonData, json0, bodyStyle, bodyLink) {	
		try {
			var body = new Array();
			$.each(jsonData, function(r, row) {
				rowsLength = body.push(new Array());
				$.each(row, function(key, col) {					
					if (bodyStyle[key]==null && bodyLink[key]==null) {
						if (key.substring(0,1)!='_' )
							body[r].push(new Array(col, null, null));
					} else if (bodyStyle[key]!=null && bodyLink[key]==null) {
						if (key.substring(0,1)!='_' )
							body[r].push(new Array(col, bodyStyle[key], null));
					} else if (bodyStyle[key]==null && bodyLink[key]!=null) {
						if (key.substring(0,1)!='_' )
							body[r].push(new Array(col, null, bodyLink[key]));
					} else {
						if (key.substring(0,1)!='_' )
							body[r].push(new Array(col, bodyStyle[key], bodyLink[key]));
					}					
				});
			});
			this.body = body;
			this.rows = rowsLength;
		}
		catch(e) {
			this.logError(e);
		}	
	},
	
	initFooter: function(jsonData, footerFoo, bodyStyle, footerStyle) {
		try {
			var footerData = new Array();
			for (var i=0; i<footerFoo.length; i++) {
				$.each(footerFoo[i], function(field, foo) {
					for (var j=0; j<jsonData.length; j++) {
						$.each(jsonData[j], function(jsonField, jsonValue) {
							if (field==jsonField) {
								switch(foo) {
									case 'COUNT':
										footerData.push({"FIELD":jsonField,"FOO":foo,"VALUE":jsonValue});
										break;
									case 'SUM':
										footerData.push({"FIELD":jsonField,"FOO":foo,"VALUE":jsonValue});
										break;
									case 'AVG':
										footerData.push({"FIELD":jsonField,"FOO":foo,"VALUE":jsonValue});
										break;
									case 'MIN':
										footerData.push({"FIELD":jsonField,"FOO":foo,"VALUE":jsonValue});
										break;
									case 'MAX':
										footerData.push({"FIELD":jsonField,"FOO":foo,"VALUE":jsonValue});
										break;
								}
							}
						});
					}
				});
			}
			
			var footerResults = new Object();
			for(var i=0; i<this.header.length; i++) {
				footerResults[this.header[i]]=null;			
			}
			
			var avgCounter = 0;
			var avgSum = 0;
			var minArray = new Array();
			var maxArray = new Array();
			Array.prototype.min = function() {
				return Math.min.apply({},this)
			}
			Array.prototype.max = function() {
				return Math.max.apply({},this)
			}
			for (var i=0; i<footerFoo.length; i++) {
				$.each(footerFoo[i], function(field, foo) {
					for(var j=0; j<footerData.length; j++) {				
						if ( field==footerData[j]['FIELD'] && foo==footerData[j]['FOO'] ) {
							switch (foo) {
								case 'COUNT':
									footerResults[field]++;
									break;
								case 'SUM':
									footerResults[field] += footerData[j]['VALUE'];
									break;
								case 'AVG':
									avgCounter++;
									avgSum += footerData[j]['VALUE'];
									footerResults[field] = avgSum/avgCounter;
									break
								case 'MIN':
									minArray.push(footerData[j]['VALUE']);
									footerResults[field] = minArray.min();
									break;
								case 'MAX':
									maxArray.push(footerData[j]['VALUE']);
									footerResults[field] = maxArray.max();
									break;
							}
						}
					}
				});
			}		
			
			var footerResultsStyled = new Object();		
			$.each(footerResults, function(field, value) {
				if (bodyStyle[field]==null && footerStyle[field]==null) {
					footerResultsStyled[field] = new Array(value, null, null);
				} else if (bodyStyle[field]!=null && footerStyle[field]==null) {
					footerResultsStyled[field] = new Array(value, bodyStyle[field], null);						
				} else if (bodyStyle[field]==null && footerStyle[field]!=null) {						
					footerResultsStyled[field] = new Array(value, null, footerStyle[field]);
				} else {
					footerResultsStyled[field] = new Array(value, bodyStyle[field], footerStyle[field]);
				}					
			});
			
			this.footer = footerResultsStyled;
		}
		catch(e) {
			this.logError(e);
		}
	},
	
	show: function($table) {
		try {
			
			this.empty($table);
		
			var th='';
			for(var i=0; i<this.columns; i++)
				th += '<th>'+this.header[i]+'</th>';
			$($table[0]).find('thead').empty().append(th);

			var trtd;
			for(var i=0; i<this.rows; i++) {
				trtd += '<tr>';
				for(var j=0; j<this.columns; j++) {
				
					if (typeof this.body[i][j][0]=='string') {
						if(this.body[i][j][0].indexOf(':')!=-1) {													
							td = this.body[i][j][0].split(':');
						} else {
							td = new Array(this.body[i][j][0],'');
						}
					} else {
						td = new Array(this.body[i][j][0],'');
					}	
					
					trtd += '<td title="'+td[1]+'" class="'+this.body[i][j][1]+'">';
						if ( this.body[i][j][1]=='chjsmoney' && this.body[i][j][2]==null )
							trtd += Globalize.format(td[0], "c" );
						else if ( this.body[i][j][1]=='chjspercentage' && this.body[i][j][2]==null )
							trtd += Globalize.format(td[0], "p" );
						else if (this.body[i][j][1]==null && this.body[i][j][2]!=null)
							trtd += '<a href="'+this.body[i][j][2]+td[0]+'" target="_blank">'+td[0]+'</a>';
						else if (this.body[i][j][1]=='chjsmoney' && this.body[i][j][2]!=null)
							trtd += '<a href="'+this.body[i][j][2]+td[0]+'" target="_blank">'+Globalize.format(td[0], "c" )+'</a>';
						else if (this.body[i][j][1]=='chjspercentage' && this.body[i][j][2]!=null)
							trtd += '<a href="'+this.body[i][j][2]+td[0]+'" target="_blank">'+Globalize.format(td[0], "p" )+'</a>';
						else
							trtd += td[0];						
					trtd += '</td>';
				}
				trtd += '</tr>';
			}
			$($table[0]).find('tbody').empty().append(trtd);
			
			var th='';		
			for(var i=0; i<this.columns; i++) {
				
				var thArr =  this.footer[this.header[i]][2]==null ? null : this.footer[this.header[i]][2].split('|');
			
				if ( 		this.footer[this.header[i]][0] != null 
						&& this.footer[this.header[i]][1] == null
						&& thArr == null )
					th += '<th>'+this.footer[this.header[i]][0]+'</th>';					
				else if (this.footer[this.header[i]][0] != null 
						&& this.footer[this.header[i]][1] == 'chjsmoney'
						&& thArr == null )
					th += '<th>'+Globalize.format(this.footer[this.header[i]][0], "c" )+'</th>';					
				else if (this.footer[this.header[i]][0] != null 
						&& this.footer[this.header[i]][1] == 'chjspercentage'
						&& thArr == null )
					th += '<th>'+Globalize.format(this.footer[this.header[i]][0], "p" )+'</th>';					
				else if (this.footer[this.header[i]][0] != null 
						&& this.footer[this.header[i]][1] == null
						&& thArr != null )
					th += '<th '+thArr[0]+' >'+this.footer[this.header[i]][0]+'</th>';					
				else if (this.footer[this.header[i]][0] != null 
						&& this.footer[this.header[i]][1] == 'chjsmoney'
						&& thArr != null )
					th += '<th '+thArr[0]+' >'+Globalize.format(this.footer[this.header[i]][0], "c" )+'</th>';					
				else if (this.footer[this.header[i]][0] != null 
						&& this.footer[this.header[i]][1] == 'chjspercentage'
						&& thArr != null )
					th += '<th '+thArr[0]+' >'+Globalize.format(this.footer[this.header[i]][0], "c" )+'</th>';
				else if (this.footer[this.header[i]][0] == null 
						&& this.footer[this.header[i]][1] == null
						&& thArr != null )
					th += '<th '+thArr[0]+' >'+thArr[1]+'</th>';
								
				else if (this.footer[this.header[i]][0] == null 
						&& this.footer[this.header[i]][1] != ''
						&& thArr != null )
					th += '<th '+thArr[0]+' >'+thArr[1]+'</th>';				
			
			}
			$($table[0]).find('tfoot').empty().append(th);
		}

		catch(e) {
			this.logError(e);
		}
	},
	
	empty: function($table) {
		$($table[0]).find('thead').empty();
		$($table[0]).find('tbody').empty();
		$($table[0]).find('tfoot').empty();
	},
	
	logError: function(e) {
		alert('jsTable Error: '+e);
	}	
};