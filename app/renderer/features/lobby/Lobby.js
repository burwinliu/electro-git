import React from 'react';

import './Lobby.css'

export const LobbyPage = () => {

    return (
        <div class="page center-v">
            <div class="main">
                <h1 id="intro-title">Welcome - Let us begin</h1>
                <div class="row row-stretched-between">
                <button class="waves-effect waves-light btn btn-standard modal-trigger" data-target="modal-form-openrepo">
                    Open a directory (repository)
                </button>
                <button class="waves-effect waves-light btn btn-standard modal-trigger" data-target="modal-form-createrepo">
                    Create a repository
                </button>
                <button class="waves-effect waves-light btn btn-standard modal-trigger" data-target="modal-form-clonerepo">
                    Clone (Copy) a repository
                </button>
                </div>
            </div>
        </div>
    )
}

export default LobbyPage; 