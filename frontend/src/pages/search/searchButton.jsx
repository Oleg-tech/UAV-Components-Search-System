import React, { useEffect } from 'react';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';

export const SearchButton = () => {
    useEffect(() => {
        const searchFocus = document.getElementById('search-focus');
        const keys = [
            { keyCode: 'AltLeft', isTriggered: false },
            { keyCode: 'ControlLeft', isTriggered: false },
        ];

        const handleKeyDown = (e) => {
            keys.forEach((obj) => {
                if (obj.keyCode === e.code) {
                    obj.isTriggered = true;
                }
            });

            const shortcutTriggered = keys.filter((obj) => obj.isTriggered).length === keys.length;

            if (shortcutTriggered) {
                searchFocus.focus();
            }
        };

        const handleKeyUp = (e) => {
            keys.forEach((obj) => {
                if (obj.keyCode === e.code) {
                    obj.isTriggered = false;
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div className="input-group" style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "20px", maxWidth: "700px" }}>
            <div className="form-outline">
                <MDBInput id="search-focus component-search-input" type="search" className="form-control" label="Пошук" name="query"/>
            </div>
            <MDBBtn color="primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
            </MDBBtn>
        </div>
    );
};
