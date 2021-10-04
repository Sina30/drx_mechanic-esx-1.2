ESX = nil

Citizen.CreateThread(function()
	while ESX == nil do
		TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
		Citizen.Wait(0)
	end

	while ESX.GetPlayerData().job == nil do
		Citizen.Wait(10)
	end

	PlayerData = ESX.GetPlayerData()
end)

RegisterNetEvent('drx_mechanic:open')
AddEventHandler('drx_mechanic:open', function(firstname, lastname)
    SetNuiFocus(true, true)
    SendNUIMessage({
        Open = true,
        firstname = firstname,
        lastname = lastname
    })
end)

function Close()
    SetNuiFocus(false, false)
    SendNUIMessage({
        close = true
    })
end

-- NUI Callbacks
RegisterNUICallback('close', function(data)
    SetNuiFocus(false, false)
end)

RegisterNUICallback('searchDatabase', function(data)
    TriggerServerEvent('drx_mechanic:searchDatabase', data)
end)

RegisterNUICallback('selectVehicle', function(data)
    TriggerServerEvent('drx_mechanic:selectVehicle', data)
end)

RegisterNUICallback('SearchJobs', function(data)
    TriggerServerEvent('drx_mechanic:SearchJobs', data)
end)

RegisterNUICallback('upgradeVehicle', function(data)
    local ped = PlayerPedId()
    local veh = GetVehiclePedIsIn(ped, false)
    local props = ESX.Game.GetVehicleProperties(veh)
    if data.plate then
        if props.plate == data.plate then
            if not IsPedOnFoot(ped) and IsPedInVehicle(ped, veh, false) then
                ESX.TriggerServerCallback('drx_mechanic:upgradeVehicle', function(valid)
                    if valid then
                        SetVehicleProperties(veh, data)
                        exports['mythic_notify']:SendAlert('inform', data.plate.. ' ' ..Config.Notifications.Modified)
                    end
                end, data)
            end
        else
            exports['mythic_notify']:SendAlert('inform', Config.Notifications.WrongVehNoOwner)
        end
    end
end)

-- NUI Updates
RegisterNetEvent('drx_mechanic:returnJobsSearch')
AddEventHandler('drx_mechanic:returnJobsSearch', function(results)
    SendNUIMessage({
        update = 'returnJobsSearch',
        SearchJobResults = results
    })
end)

RegisterNetEvent('drx_mechanic:returnDatabaseSearch')
AddEventHandler('drx_mechanic:returnDatabaseSearch', function(results)
    SendNUIMessage({
        update = 'returnDatabaseSearch',
        SearchResults = results
    })
end)

RegisterNetEvent('drx_mechanic:returnDatabaseSelection')
AddEventHandler('drx_mechanic:returnDatabaseSelection', function(identifier, firstname, lastname, plate, type, mods)
    SendNUIMessage({
        update = 'returnDatabaseSelection',
        identifier = identifier,
        firstname = firstname,
        lastname = lastname,
        plate = plate,
        type = type,
        mods = mods
    })
end)

-- Functions
SetVehicleProperties = function(vehicle, data)
	SetVehicleModKit(vehicle, 0)
    if data.brakes ~= nil then
		SetVehicleMod(vehicle, 12, data.brakes, false)
	end

    if data.transmission ~= nil then
		SetVehicleMod(vehicle, 13, data.transmission, false)
	end

	if data.suspension ~= nil then
		SetVehicleMod(vehicle, 15, data.suspension, false)
	end

    if data.engine ~= nil then
		SetVehicleMod(vehicle, 11, data.engine, false)
	end

	if data.tune ~= nil then
        if data.tune == 0 then
            ToggleVehicleMod(vehicle,  18, false)
        elseif data.tune == 1 then
            ToggleVehicleMod(vehicle,  18, true)
        end
	end
    local props = ESX.Game.GetVehicleProperties(vehicle)
    TriggerServerEvent('drx_mechanic:updateProps', data, props)
end