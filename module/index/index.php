<link rel="stylesheet" href="module/index/index.css">
<div class="body container-fluid">

    <div class="center">
        <div class="table-f">
            <div class="head-table">
                <p class="t-text"><i class="fa-solid fa-database"></i> User Data</p>
                <div>
                    <button class="plus"><i class="fa-solid fa-plus"></i></button>
                    <button class="fliter"><i class="fa-solid fa-filter"></i></button>
                    <div class="fliter-modal" style="display:none;">
                        <p>Fliter Data</p>
                        <div class="line"></div>
                        <div class="inp">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <input type="text" class="form-control" id="serVal" placeholder="Serch Value">
                        </div>
                        <span class="labelspan">Date :</span>
                        <div class="dateInp">
                            <input type="datetime-local" id="date-f" class="form-control" placeholder="Serch Value">
                            <span>-</span>
                            <input type="datetime-local" id="date-l" class="form-control" placeholder="Serch Value">
                        </div>
                        <div class="line"></div>
                        <span class="labelspan">Status :</span>
                        <div class="checkinp">
                            <div class="check">
                                <input id="statusCheck" value="100" type="checkbox">
                                <span>Admin</span>
                            </div>
                            <div class="check">
                                <input id="statusCheck" value="200" type="checkbox">
                                <span>Member</span>
                            </div>
                            <div class="check">
                                <input id="statusCheck" value="300" type="checkbox">
                                <span>Ban</span>
                            </div>
                        </div>
                        <div class="line"></div>
                        <button class="btnSerch" id="Serch"><i class="fa-solid fa-magnifying-glass"></i>
                            <span>Serch</span></button>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th><input type="checkbox" id="checkAll"></th>
                        <th>Profile</th>
                        <th>Password</th>
                        <th><button id="sortData" data-val="Phone">Phone <i class="fa-solid fa-sort"></i></button></th>
                        <th><button id="sortData" data-val="Date">Date <i class="fa-solid fa-sort"></i></button></th>
                        <th><button id="sortData" data-val="status">status <i class="fa-solid fa-sort"></i></button>
                        </th>
                        <th class="text-center">Action</th>
                    </tr>
                </thead>
                <tbody id="tbody"></tbody>
            </table>
            <div class="loaderFrame">
                <span class="loader"></span>
            </div>
            <div class="pagination" style="display: none;">
                <div class="left">
                    <span><span id="Cupage"></span> of <span id="Totalpage"></span> page</span>
                    <div>
                        <select id="limit_row">
                            <option value="25" selected>25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="250">250</option>
                        </select>
                        <span>rows</span>
                    </div>
                </div>
                <div class="right">
                    <ul id="pagi"></ul>
                </div>
            </div>
        </div>
        <div class="add-f" style="display: none">
            <p class="textF">Add customer</p>
            <div class="line"></div>
            <div id="form_Add"></div>
            <div class="button-contain"></div>
        </div>
    </div>
</div>

<script src="module/index/index.js"></script>