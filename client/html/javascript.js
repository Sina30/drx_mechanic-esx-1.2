const drx_mechanic = new Vue({
    el: '#DRX_MECHANIC',
    vuetify: new Vuetify(),
    data: () => ({
        Open: false,
        Firstname: null,
        Lastname: null,
        loading: null,
        CurrentPage: 'DATABASE',
        Pages: ['ALL JOBS', 'DATABASE', 'AVAILABLE MODIFICATIONS'],

        // ALL JOBS
        SearchJobs: '',
        SearchJobResults: {},
        ResultsJobsActive: false,

        // DATABASE PAGE
        SearchInput: '',
        SearchResults: {},
        ResultsActive: false,
        ShowStats: false,
        NewJob: false,
        SelectMods: false,
        SelectedVehicle: {
            identifier: null,
            firstname: null,
            lastnname: null,
            plate: null,
            type: null,
            mods: {},
            brakes: null,
            transmission: null,
            suspension: null,
            engine: null,
            tune: null
        },
        BillAmount: 100,
        Note: '',

        CurrentBrakes: null,
        CurrentTransmission: null,
        CurrentSuspension: null,
        CurrentEngine: null,
        CurrentTune: null,

        SelectedBrakes: null,
        SelectedTransmission: null,
        SelectedSuspension: null,
        SelectedEngine: null,
        SelectedTune: null,

        // AVAILBLE MODIFICATIONS PAGE
        Modifications: {
            Brakes: {
                Stock: { Price: 0, Label: 'Stock Brakes', Desc: 'This is the stock version', Image: 'images/Brakes/brakesD.png', Index: 12, Upgrade: -1 },
                Street: { Price: 5000, Label: 'Street Brakes', Desc: 'This is the street version', Image: 'images/Brakes/brakesC.png', Index: 12, Upgrade: 0 },
                Sport: { Price: 10000, Label: 'Sport Brakes', Desc: 'This is the sport version', Image: 'images/Brakes/brakesB.png', Index: 12, Upgrade: 1 },
                Race: { Price: 15000, Label: 'Race Brakes', Desc: 'This is the race version', Image: 'images/Brakes/brakesA.png', Index: 12, Upgrade: 2 },
            },
            Transmission: {
                Stock: { Price: 0, Label: 'Stock Transmission', Desc: 'This is the stock version', Image: 'images/Transmission/transmissionD.png', Index: 13, Upgrade: -1 },
                Street: { Price: 5000, Label: 'Street Transmission', Desc: 'This is the street version', Image: 'images/Transmission/transmissionC.png', Index: 13, Upgrade: 0 },
                Sport: { Price: 10000, Label: 'Sport Transmission', Desc: 'This is the sport version', Image: 'images/Transmission/transmissionB.png', Index: 13, Upgrade: 1 },
                Race: { Price: 15000, Label: 'Race Transmission', Desc: 'This is the race version', Image: 'images/Transmission/transmissionA.png', Index: 13, Upgrade: 2 },
            },
            Suspension: {
                Stock: { Price: 0, Label: 'Stock Suspension', Desc: 'This is the stock version', Image: 'images/Suspension/suspensionD.png', Index: 15, Upgrade: -1 },
                Lowered: { Price: 500, Label: 'Lowered Suspension', Desc: 'This is the lowered version', Image: 'images/Suspension/suspensionC.png', Index: 15, Upgrade: 0 },
                Street: { Price: 1000, Label: 'Street Suspension', Desc: 'This is the street version', Image: 'images/Suspension/suspensionB.png', Index: 15, Upgrade: 1 },
                Sport: { Price: 2000, Label: 'Sport Suspension', Desc: 'This is the street sport version', Image: 'images/Suspension/suspensionA.png', Index: 15, Upgrade: 2 },
                Competition: { Price: 3000, Label: 'Competition Suspension', Desc: 'This is the street competition version', Image: 'images/Suspension/suspensionS.png', Index: 15, Upgrade: 3 },
            },
            Engine: {
                Stock: { Price: 0, Label: 'Stock Engine', Desc: 'This is the stock version', Image: 'images/Engine/engineD.png', Index: 11, Upgrade: -1 },
                Level2: { Price: 15000, Label: 'Engine Level 2', Desc: 'This engine is tier 2', Image: 'images/Engine/engineC.png', Index: 11, Upgrade: 0 },
                Level3: { Price: 30000, Label: 'Engine Level 3', Desc: 'This engine is tier 3', Image: 'images/Engine/engineB.png', Index: 11, Upgrade: 1 },
                Level4: { Price: 45000, Label: 'Engine Level 4', Desc: 'This engine is tier 4', Image: 'images/Engine/engineA.png', Index: 11, Upgrade: 2 },
            },
            Turbo: {
                Stock: { Price: 0, Label: 'Turbo Off', Desc: 'This is the stock version', Image: 'images/Tune/tuneOff.png', Index: 18, Upgrade: 0 },
                Turbo: { Price: 15000, Label: 'Turbo On', Desc: 'This turns on the turbo', Image: 'images/Tune/tuneOn.png', Index: 18, Upgrade: 1 },
            },
        },
    }),

    methods: {
        OpenMenu(firstname, lastname) {
            this.Open = true;
            this.Firstname = firstname;
            this.Lastname = lastname;
            this.CurrentPage = 'DATABASE';
        },
        CloseMenu() {
            this.Open = false;
            this.ConfirmJob = false;
            $.post('https://drx_mechanic/close');
        },
        ChangePage(Pages) {
            this.CurrentPage = Pages;
        },

        // ALL JOBS PAGE
        SearchJobsDatabase(SearchJobs) {
            this.loading = 'loader';
            $.post('https://drx_mechanic/SearchJobs', JSON.stringify({
                SearchJobs
            }))
        },
        SearchJobsDatabaseClear() {
            this.SearchJobs = '';
            this.SearchJobResults = {};
        },

        // DATABASE PAGE
        SearchDatabase(SearchInput) {
            this.loading = 'loader';
            $.post('https://drx_mechanic/searchDatabase', JSON.stringify({
                SearchInput
            }))
        },
        SelectVehicle(plate) {
            this.loading = 'loader';
            $.post('https://drx_mechanic/selectVehicle', JSON.stringify({
                plate
            }))
        },
        SearchDatabaseClear() {
            this.SearchInput = '';
            this.SearchResults = {};
            this.ShowStats = false;
            this.SelectedVehicle = {
                identifier: null,
                firstname: null,
                lastname: null,
                plate: null,
                type: null,
                mods: {},
                brakes: null,
                transmission: null,
                suspension: null,
                engine: null,
                tune: null,
            };
        },
        ConfirmMod() {
            if (this.SelectedBrakes || this.SelectedTransmission || this.SelectedSuspension || this.SelectedEngine || this.SelectedTune) {
                $.post('https://drx_mechanic/upgradeVehicle', JSON.stringify({
                    brakes: this.SelectedBrakes,
                    transmission: this.SelectedTransmission,
                    suspension: this.SelectedSuspension,
                    engine: this.SelectedEngine,
                    tune: this.SelectedTune,

                    brakesL: this.BrakesLabel,
                    transmissionL: this.TransmissionLabel,
                    suspensionL: this.SuspensionLabel,
                    engineL: this.EngineLabel,
                    tuneL: this.TuneLabel,

                    bill: this.BillAmount,
                    note: this.Note,
                    plate: this.SelectedVehicle.plate,
                    mname: this.Firstname + ' ' + this.Lastname,
                    cname: this.SelectedVehicle.firstname + ' ' + this.SelectedVehicle.lastname,
                }))
            } else {
                console.log('drx_mechanic - [values missing from selected selected modifications]')
            }
        },



        // Updates
        ReturnSelectedVehicle(identifier, firstname, lastname, plate, type, mods) {
            // Insert the information into SelectedVehicle
            this.SelectedVehicle = {
                identifier: identifier,
                firstname: firstname,
                lastname: lastname,
                plate: plate,
                type: type,
                mods: mods,
            };
            this.CurrentBrakes = null;
            this.CurrentTransmission = null;
            this.CurrentSuspension = null;
            this.CurrentEngine = null;
            this.CurrentTune = null;

            this.SelectedBrakes = null;
            this.SelectedTransmission = null;
            this.SelectedSuspension = null;
            this.SelectedEngine = null;
            this.SelectedTune = null;
            // Brakes
            if (mods.modBrakes === 2) {
                this.SelectedVehicle.brakes = 'Brakes: A';
                this.CurrentBrakes = 2;
                this.SelectedBrakes = 2;
            } else
            if (mods.modBrakes === 1) {
                this.SelectedVehicle.brakes = 'Brakes: B';
                this.CurrentBrakes = 1;
                this.SelectedBrakes = 1;
            } else if (mods.modBrakes === 0) {
                this.SelectedVehicle.brakes = 'Brakes: C';
                this.CurrentBrakes = 0;
                this.SelectedBrakes = 0;
            } else if (mods.modBrakes === -1) {
                this.SelectedVehicle.brakes = 'Brakes: D';
                this.CurrentBrakes = -1;
                this.SelectedBrakes = -1;
            }
            // Transmission
            if (mods.modTransmission === 2) {
                this.SelectedVehicle.transmission = 'Transmission: A';
                this.CurrentTransmission = 2;
                this.SelectedTransmission = 2;
            } else if (mods.modTransmission === 1) {
                this.SelectedVehicle.transmission = 'Transmission: B';
                this.CurrentTransmission = 1;
                this.SelectedTransmission = 1;
            } else if (mods.modTransmission === 0) {
                this.SelectedVehicle.transmission = 'Transmission: C';
                this.CurrentTransmission = 0;
                this.SelectedTransmission = 0;
            } else if (mods.modTransmission === -1) {
                this.SelectedVehicle.transmission = 'Transmission: D';
                this.CurrentTransmission = -1;
                this.SelectedTransmission = -1;
            }
            // Suspension
            if (mods.modSuspension === 3) {
                this.SelectedVehicle.suspension = 'Suspension: S';
                this.CurrentSuspension = 3;
                this.SelectedSuspension = 3;
            } else if (mods.modSuspension === 2) {
                this.SelectedVehicle.suspension = 'Suspension: A';
                this.CurrentSuspension = 2;
                this.SelectedSuspension = 2;
            } else if (mods.modSuspension === 1) {
                this.SelectedVehicle.suspension = 'Suspension: B';
                this.CurrentSuspension = 1;
                this.SelectedSuspension = 1;
            } else if (mods.modSuspension === 0) {
                this.SelectedVehicle.suspension = 'Suspension: C';
                this.CurrentSuspension = 0;
                this.SelectedSuspension = 0;
            } else if (mods.modSuspension === -1) {
                this.SelectedVehicle.suspension = 'Suspension: D';
                this.CurrentSuspension = -1;
                this.SelectedSuspension = -1;
            }
            // Engine
            if (mods.modEngine === 2) {
                this.SelectedVehicle.engine = 'Engine: A';
                this.CurrentEngine = 2;
                this.SelectedEngine = 2;
            } else if (mods.modEngine === 1) {
                this.SelectedVehicle.engine = 'Engine: B';
                this.CurrentEngine = 1;
                this.SelectedEngine = 1;
            } else if (mods.modEngine === 0) {
                this.SelectedVehicle.engine = 'Engine: C';
                this.CurrentEngine = 0;
                this.SelectedEngine = 0;
            } else if (mods.modEngine === -1) {
                this.SelectedVehicle.engine = 'Engine: D';
                this.CurrentEngine = -1;
                this.SelectedEngine = -1;
            }
            // Engine
            if (mods.modTurbo === 1) {
                this.SelectedVehicle.tune = 'Tune: On';
                this.CurrentTune = 1;
                this.SelectedTune = 1;
            } else if (mods.modTurbo === false) {
                this.SelectedVehicle.tune = 'Tune: Off';
                this.CurrentTune = 0;
                this.SelectedTune = 0;
            }
            // Show images with stats & stop the loading
            this.ShowStats = true;
            this.loading = null;
        },
    }
})

document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
        window.addEventListener('message', (event) => {
            var drx = event.data;

            if (drx.Open) {
                drx_mechanic.OpenMenu(drx.firstname, drx.lastname)
            }

            if (drx.update == 'returnJobsSearch') {
                drx_mechanic.SearchJobResults = drx.SearchJobResults;
                drx_mechanic.loading = null;
            }

            if (drx.update == 'returnDatabaseSearch') {
                drx_mechanic.SearchResults = drx.SearchResults;
                drx_mechanic.loading = null;
            }

            if (drx.update == 'returnDatabaseSelection') {
                drx_mechanic.ReturnSelectedVehicle(drx.identifier, drx.firstname, drx.lastname, drx.plate, drx.type, drx.mods)
            }

            document.onkeyup = function(data) {
                if (data.which == 27) {
                    drx_mechanic.CloseMenu();
                }
            };
        });
    };
};