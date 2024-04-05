import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Logout from './Logout';

function HardwareSet() {
    const location = useLocation();
    const projectName = location.state?.projectName || 'ProjectName';
    const [hwSet1, setHwSet1] = useState({ name: 'HWSet1', capacity: 100, availability: 10 });
    const [hwSet2, setHwSet2] = useState({ name: 'HWSet2', capacity: 100, availability: 20 });
    const [requestSet1, setRequestSet1] = useState('');
    const [requestSet2, setRequestSet2] = useState('');

    useEffect(() => {
        fetchHardwareSets();
    }, []);

    const fetchHardwareSets = async () => {
        console.log('GETTING HARDWARE SETS');
        const fetchSetData = async (hwSetName) => {
            const response = await fetch(`/get_hardware_set`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'hwSetName': hwSetName }),
            });
            const data = await response.json();
            console.log('Data:', data);
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            return data;
        };

        try {
            const hwSet1Data = await fetchSetData('HWSet1');
            console.log('HWSet1 Data:', hwSet1Data);
            const hwSet2Data = await fetchSetData('HWSet2');
            console.log('HWSet2 Data:', hwSet2Data);
            setHwSet1(hwSet1Data);
            setHwSet2(hwSet2Data);
        } catch (error) {
            console.error("Error fetching hardware sets:", error);
        }
    };

    const updateHardwareSet = async (hwSetName, quantity, action) => {
        console.log('UPDATING HARDWARE SETS');
        const endpoint = `/${action}`; // Use action parameter to choose between 'checkin' and 'checkout'
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ hwSetName, quantity }),
        });

        const data = await response.json();
        if (response.ok) {
            // Update local state to reflect the new availability
            if (hwSetName === 'HWSet1') {
                setHwSet1(prev => ({ ...prev, availability: action === 'checkin' ? Math.min(prev.capacity, prev.availability + quantity) : Math.max(0, prev.availability - quantity) }));
            } else if (hwSetName === 'HWSet2') {
                setHwSet2(prev => ({ ...prev, availability: action === 'checkin' ? Math.min(prev.capacity, prev.availability + quantity) : Math.max(0, prev.availability - quantity) }));
            }
            alert(data.message); // Display success message
        } else {
            alert(data.error); // Display error message
        }
    };

    const handleCheckIn = (hwSet, request) => {
        const requestNumber = parseInt(request, 10);
        if (!isNaN(requestNumber) && requestNumber > 0) {
            updateHardwareSet(hwSet.name, requestNumber, 'checkin');
        } else {
            alert('Please enter a valid positive number');
        }
    };

    const handleCheckOut = (hwSet, request) => {
        const requestNumber = parseInt(request, 10);
        if (!isNaN(requestNumber) && requestNumber > 0) {
            console.log('Checking out', requestNumber, 'from', hwSet.name);
            updateHardwareSet(hwSet.name, requestNumber, 'checkout');
        } else {
            alert('Please enter a valid positive number');
        }
    };

    return (
        <div>
            <Logout/> 
            <h1>{projectName}</h1>
            <div>
                {/* HWSet1 Section */}
                <h2>{hwSet1.name}</h2>
                <div>
                    <p>Capacity: {hwSet1.capacity}</p>
                    <p>Availability: {hwSet1.availability}</p>
                </div>
                <div>
                    <input
                        type="number"
                        value={requestSet1}
                        onChange={(e) => setRequestSet1(e.target.value)}
                        placeholder="request"
                    />
                    <button className="resource-button" onClick={() => handleCheckIn(hwSet1, requestSet1)}>Check In</button>
                    <button className="resource-button" onClick={() => handleCheckOut(hwSet1, requestSet1)}>Check Out</button>
                </div>
            </div>
            <div>
                {/* HWSet2 Section */}
                <h2>{hwSet2.name}</h2>
                <div>
                    <p>Capacity: {hwSet2.capacity}</p>
                    <p>Availability: {hwSet2.availability}</p>
                </div>
                <div>
                    <input
                        type="number"
                        value={requestSet2}
                        onChange={(e) => setRequestSet2(e.target.value)}
                        placeholder="request"
                    />
                    <button className="resource-button" onClick={() => handleCheckIn(hwSet2, requestSet2)}>Check In</button>
                    <button className="resource-button" onClick={() => handleCheckOut(hwSet2, requestSet2)}>Check Out</button>
                </div>
            </div>
        </div>
    );
}

export default HardwareSet;



