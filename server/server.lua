ESX = nil
TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

-- Open command
RegisterCommand(Config.Command, function(source)
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    if xPlayer.job.name == Config.Permission then
        MySQL.Async.fetchAll('SELECT firstname, lastname FROM users WHERE identifier = @identifier', {
            ['@identifier'] = xPlayer.getIdentifier()
        }, function(result)
            TriggerClientEvent('drx_mechanic:open', src, result[1].firstname, result[1].lastname)
            print('drx_mechanic:open')
        end)
    end
end)

-- User searches in database, and sends the info back to ui
RegisterServerEvent('drx_mechanic:SearchJobs')
AddEventHandler('drx_mechanic:SearchJobs', function(data)
    local src = source
    MySQL.Async.fetchAll('SELECT * FROM drx_mechanic WHERE mechanic_id LIKE @SearchJobs OR customer_id LIKE @SearchJobs OR mechanic_name LIKE @SearchJobs OR customer_name LIKE @SearchJobs OR plate LIKE @SearchJobs', {
        ['@SearchJobs'] = string.lower('%'..data.SearchJobs..'%')
	}, function(result)
        local SearchJobResults = {}
        for k,v in ipairs(result) do
            v.upgrades = json.decode(v.upgrades)
            table.insert(SearchJobResults, v)
        end
        TriggerClientEvent('drx_mechanic:returnJobsSearch', src, SearchJobResults)
    end)
end)

-- User searches in database, and sends the info back to ui
RegisterServerEvent('drx_mechanic:searchDatabase')
AddEventHandler('drx_mechanic:searchDatabase', function(data)
    local src = source
    MySQL.Async.fetchAll('SELECT * FROM owned_vehicles WHERE plate LIKE @SearchInput', {
        ['@SearchInput'] = string.lower('%'..data.SearchInput..'%')
	}, function(result)
        local SearchResults = {}
        for k,v in ipairs(result) do
            table.insert(SearchResults, v)
        end
        TriggerClientEvent('drx_mechanic:returnDatabaseSearch', src, SearchResults)
    end)
end)

-- Select vehicle plate, and return all information (if changes has been made, then it keeps being updated, instead of being updated only when running "searchDatabase")
RegisterServerEvent('drx_mechanic:selectVehicle')
AddEventHandler('drx_mechanic:selectVehicle', function(data)
    local src = source
    MySQL.Async.fetchAll('SELECT * FROM owned_vehicles WHERE plate LIKE @plate', {
        ['@plate'] = string.lower('%'..data.plate..'%')
	}, function(vehicle)
        MySQL.Async.fetchAll('SELECT * FROM users WHERE identifier = @identifier', {
            ['@identifier'] = vehicle[1].owner
        }, function(identity)
            local target = ESX.GetPlayerFromIdentifier(identity[1].identifier)
            TriggerClientEvent('drx_mechanic:returnDatabaseSelection', src, target.source, identity[1].firstname, identity[1].lastname, vehicle[1].plate, vehicle[1].type, json.decode(vehicle[1].vehicle))
        end)
    end)
end)

-- Check if the plate the user is in exists in the database, and then bill the player for the modification
ESX.RegisterServerCallback('drx_mechanic:upgradeVehicle', function(source, cb, data)
    local src = source
    local bill = tonumber(data.bill)
    if data.plate ~= nil then
        MySQL.Async.fetchAll('SELECT * FROM owned_vehicles WHERE plate = @plate', {
            ['@plate'] = data.plate
        }, function(result)
            if result[1] ~= nil and ESX.GetPlayerFromIdentifier(result[1].owner) then
                local target = ESX.GetPlayerFromIdentifier(result[1].owner)
                local bankAccount = target.getAccounts('bank').bank
                if bankAccount >= bill then
                    local xPlayer = ESX.GetPlayerFromId(src)
                    newBalance = bankAccount - bill
                    target.setAccountMoney('bank', newBalance)
                    local modifications = '{'..'"Brakes":' ..data.brakes.. ',"Transmission":' ..data.transmission.. ',"Suspension":' ..data.suspension.. ',"Engine":' ..data.engine.. ',"Tune":' ..data.tune..'}'
                    MySQL.Async.insert('INSERT INTO drx_mechanic (mechanic_id, customer_id, mechanic_name, customer_name, plate, upgrades, bill, note) VALUES (@mid, @cid, @mname, @cname, @plate, @upgrades, @bill, @note)', {
                        ['@mid'] = xPlayer.getIdentifier(),
                        ['@cid'] = result[1].owner,
                        ['@mname'] = data.mname,
                        ['@cname'] = data.cname,
                        ['@plate'] = data.plate,
                        ['@upgrades'] = modifications,
                        ['@bill'] = bill,
                        ['@note'] = data.note,
                    })
                    TriggerClientEvent('mythic_notify:client:SendAlert', target.source, { type = 'inform', text = Config.Notifications.Payed.. '' ..bill.. ' ' ..Config.Notifications.Payed1, length = '5000', style = {}})
                    cb(true)
                else
                    TriggerClientEvent('mythic_notify:client:SendAlert', target.source, { type = 'error', text = Config.Notifications.NotEnough, length = '5000', style = {}})
                    TriggerClientEvent('mythic_notify:client:SendAlert', src, { type = 'error', text = Config.Notifications.CantAfford, length = '5000', style = {}})
                end
            else
                cb(false)
            end
        end)
    end
end)

RegisterServerEvent('drx_mechanic:updateProps')
AddEventHandler('drx_mechanic:updateProps', function(data, props)
    if data.plate then
        MySQL.Async.fetchAll('SELECT * FROM owned_vehicles WHERE plate = @plate', {
            ['@plate'] = data.plate
        }, function(result)
            local veh = json.decode(result[1].vehicle)
            if veh.model == props.model then
                MySQL.Async.execute('UPDATE owned_vehicles SET vehicle = @vehicle WHERE plate = @plate', {
                    ['@plate'] = props.plate,
                    ['@vehicle'] = json.encode(props)
                })
            end
        end)
    end
end)