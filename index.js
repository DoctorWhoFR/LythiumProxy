/*
 *   Copyright (c) 2020 4Azgin
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

// Require the lib, get a working terminal
var term = require( 'terminal-kit' ).terminal ;
var ascii = require('ascii-art');
var Image = require('ascii-art-image');
const Font = require('ascii-art-font');
var figlet = require('figlet');
const fs = require('fs');
const configs = require('./config.json');
const { setToken, getLinodes, createLinode, deleteLinode } = require('@linode/api-v4/');
const { start } = require('repl');
var proxyChecker = require('proxy-checker');

setToken(configs.LinodesTokens);

var progressBar , progress = 0 ;


function loading()
{
    term('\n');

    term.bgGreen.white('Créer par: ').blue(' DoctorWho ! \n' )
    
    setTimeout(() => {
        term.bgGreen.white('Rejoindre le discord:').blue(' discord.gg/lazone \n')
    }, 1000);

    setTimeout(() => {
        term.bgGreen.white('Pour obtenir votre token linode:').blue(' https://linodes.com \n')
    }, 2000);

    setTimeout(() => {
        starting();
    }, 3000);
}


term.clear() ;

var image = new Image({
    filepath: './images/test.jpg',
    alphabet:'variant2'
});
 
image.write(async function(err, rendered){
    term(rendered);

    
    figlet('LythiumTools V1', function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        term.red(data)
        term('\n')


        setTimeout(() => {
            loading() ;
        }, 1000);
    });

});



//// 

function starting(){
    setTimeout(() => {
        term.clear();
    }, 1000);

    setTimeout(() => {
       menu();
    }, 2000);
}

function menu(){
    term.cyan( 'Bienvenu Hax4r dans le magnifique outils Lythium.\n' ) ;
    term.cyan( 'Que puis-je faire ?.\n' ) ;

    var items = [
        '[0] Créer un proxy',
        '[0] Listes des proxys (génère une liste dans un fichier .txt)',
        "[0] Supprimer la liste des proxy's",
        '<3 discord.gg/lazone <3'
    ] ;

    term.singleColumnMenu( items , async function( error , response ) {
        if(response.selectedIndex == 0){

            term.clear();
            var region = "";
            term.bgRed.white("/!\/ Attentions, utiliser des informations DE MERDE pour les comptes linodes /!\/ \n")

            term( 'Merci de préciser la région: ' ) ;

            var autoComplete = [
                'us-west' ,
            ] ;

            term.inputField({
                autoComplete: autoComplete , autoCompleteHint: true ,
                autoCompleteMenu: true},

                function( error , region ) {
                    
                    term("\n")
                    
                    createServer(region)
                }
            ) ;

           

          
        }
        if(response.selectedIndex == 1){
            term.clear();
            var servers = "";

            getLinodes().then(data=>{
                term.red('> Proxy List:' + '\n')
                
                
                data.data.forEach(element => {

                    if(element.status == "running"){
                        term.green("Serveur: " + element.label + " | IP : " + element.ipv4[0] + ':3128 | ' + "Status: " + element.status + '\n \n \n')

                        if(servers == ""){
                            servers = element.ipv4[0] + ':3128'
                        } else {
                            servers = servers + '\n' + element.ipv4[0] + ':3128'
                        }

                    } else if(element.status == "booting") {
                        term.blue("Serveur: " + element.label + " | IP : " + element.ipv4[0] + ':3128 | ' + "Status: " + element.status + '\n \n \n')
                    }  else {
                        term.red("Serveur: " + element.label + " | IP : " + element.ipv4[0] + ':3128 | ' + "Status: " + element.status + '\n \n \n')
                    }

                   
                });

                fs.writeFile('servers.txt', servers.replace(',', '\n'), {flag: 'w'}, writeservers => {
                })

                term.blue('Redirection dans 3 seconds...' + '\n')
                term.bgBlue('File saved !')

                term('\n');

                setTimeout(() => {
                    term.clear();
                    menu();
                }, 3000);
            })
        }

        if(response.selectedIndex == 2){
            getLinodes().then(linodes => {
                
                if(linodes.results == 0){
                    term.clear();
                    menu();
                } else {
                    linodes.data.forEach(linode => {
                        term.clear();
                        deleteLinode(linode.id).then(deletes => {
                            term.green('Deleting: ').blue( linode.label + '\n')
                        })
                    });
                    setTimeout(() => {
                        term.clear();
                        menu();
                    }, 500 * parseInt(linodes.data.length));
                }


                
            })
        }

        if(response.selectedIndex == 3){
            term.clear();
            
            term.bgRed.white('Created by DoctorWho ! \n')
            term.blue('https://discord.gg/lazone \n')

            setTimeout(() => {
                term.clear();
                menu();
            }, 2000);
        }
    } ) ;
}

function createServer(region) {
    term( 'Merci de préciser le nombre de serveur: ' ) ;
    term.inputField(null,

        async function( error , input ) {

            term("\n")

            var server_number = parseInt(input);

            for (let index = 0; index < server_number;) {
                
                await createLinode({
                    "image": "linode/debian10",
                    "root_pass": "hax4r_lythium",
                    "booted": true,
                    "label": "Lythium" + Math.floor(Math.random() * 1000),
                    "type": "g6-nanode-1",
                    "region": region,
                    "stackscript_id": 670597
                }).then( created => {
                     term.blue("#"+index).green(" | " + created.label).green(" | Ip: " + created.ipv4[0] + ':3128' + '\n')  
                }).catch( error => {
                    index = server_number;
                    term.clear();
                    menu();
                });

                index++;
                
            }

            setTimeout(() => {
                term.clear();
                menu();
            }, 1000 * parseInt(input));


        }
    ) ;
}