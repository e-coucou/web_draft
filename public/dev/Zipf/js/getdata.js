

function includePreload() {
    // france.push(loadTable('./data/1968.csv','ssv','header'));
    // france.push(loadTable('./data/1975.csv','ssv','header'));
    // france.push(loadTable('./data/1982.csv','ssv','header'));
    // france.push(loadTable('./data/1990.csv','ssv','header'));
    // france.push(loadTable('./data/1999.csv','ssv','header'));
    // france.push(loadTable('./data/2006.csv','ssv','header'));
    // france.push(loadTable('./data/2007.csv','ssv','header'));
    // france.push(loadTable('./data/2008.csv','ssv','header'));
    // france.push(loadTable('./data/2009.csv','ssv','header'));
    // france.push(loadTable('./data/2010.csv','ssv','header'));
    // france.push(loadTable('./data/2011.csv','ssv','header'));
    // france.push(loadTable('./data/2012.csv','ssv','header'));
    // france.push(loadTable('./data/2013.csv','ssv','header'));
    // france.push(loadTable('./data/2014.csv','ssv','header'));
    // france.push(loadTable('./data/2015.csv','ssv','header'));
    // france.push(loadTable('./data/2016.csv','ssv','header'));
    // france.push(loadTable('./data/2017.csv','ssv','header'));
    // france.push(loadTable('./data/2018.csv','ssv','header'));
    // france.push(loadTable('./data/2019.csv','ssv','header'));
    // france.push(loadTable('./data/2020.csv','ssv','header'));
    // dataJson = loadJSON('./data/municipalites.json');
    // france.push(loadTable('./data/2019.csv','ssv','header'));    
}

function convertPublicData() {
    villesNew = [];
    for (let i=0;i<dataVilles.length;i++) {
        let v = dataVilles[i].features;
        if (v.length>0) {
            v=v[0];
            let p = v.properties;
            let seek = v.properties.id;
            let hPop = [];
            for (let i in historique) {
                // let h = historique[i];
                let result = france[i].rows.filter(a => { return a.arr[0]==seek;});
                if (result.length>0) {
                    pop = int(result[0].arr[2].replace(/\s/g,''));
                    hPop[i]=pop;
                }
            }
            if (hPop.length>0) {
                // console.log(result)
                villesNew.push( {geometry:v.geometry.coordinates,city:p.city,id:p.id, pop:p.population, hist:hPop,poscode:p.postcode, x:p.x, y:p.y,importance:p.importance,score:p.score,context:p.context } )
            }
        }
    }
}

function getFrance() {
    villes=[];
    let min_=Infinity, max_=0;
    for (let r of france[2].rows) {
        // console.log(r.obj)
        pop = int(r.obj.PMUN20.replace(/\s/g,''));
        libelle = r.obj.NCC;
        id = r.obj.COM;
        villes.push( pop);
        if (pop<min_) min_ = pop;
        if (pop>max_) max_ = pop;
        // if (nb<1) {
            url = 'https://api-adresse.data.gouv.fr/search/?q='+libelle+'&citycode='+id+'&type=municipality';
            URLs.push({id:id, lib:libelle, population:pop, url:url});
            // info = httpGet(url, 'json', (data)=> {
            //     municipalities.push(data);
            // });
        // }
        nb++;
    }
    villes.sort((a,b)=> {return (b-a);});
    return [min_, max_];
}


function getData(num) {
    info = httpGet(URLs[num].url, 'json', (data)=> {
        municipalities.push(data);
    });
}


function setupInclude() { // valable pour get data mais aussi la simulation ZIPF
    // Init(33000); // initialisation des communes de manière aléatoire
    // let min_, max_;
    // [min_, max_] = getFrance();
    // drawVilles(min_, max_);
    // dataVilles = Object.values(dataJson);
}