$('.dropdown-toggle').dropdown('toggle')
            var r = $("#rangeslider").slider().on('slideStop', filterBySalaryRange).data('slider');

            var jsonData = new Array();
            var results = new Array();
            var id = 1;
            $(document).ready(function(){
                $.getJSON("employee.json", function(data){
                    jsonData = data;
                    results = data;
                    if(jsonData.length){
                        id = (jsonData[jsonData.length-1].id + 1);
                    }
                    offFilter();
                });

                $('#save_player').click(savePlayer);

                $("#sorting,#sorting_type").change(sortTable);

                $("#employee_table").on('click','.delete_player',function(){
                        var arrkey = $(this).data('key');
                        results.splice(arrkey, 1);
                        createTable(results);
                });

                $("#employee_table").on('click','.edit_player',function(){
                        resetForm();
                        var arrkey = $(this).data('key');
                        $('#firstname').val(results[arrkey].fname);
                        $('#lastname').val(results[arrkey].lname);
                        $('#salary').val(results[arrkey].salary);
                        $('#points').val(results[arrkey].points);
                        $('#rebounds').val(results[arrkey].rebounds);
                        $('#assists').val(results[arrkey].assists);
                        $('#steals').val(results[arrkey].steals);
                        $('#blocks').val(results[arrkey].blocks);

                        $('#myModal').modal('show');
                        $('#action_type').val('edit');
                        $('#edit_key').val(arrkey);
                });

                $("#filter_off").click(function(){
                    offFilter();
                });

                $("#filter_on").click(function(){
                    onFilter();
                });
            });

            function offFilter()
            {
                $("#filter_on").removeClass('active');
                $("#filter_off").addClass('active');
                $('#filter_option, #filter_range').hide();
                results = jsonData;
                createTable(jsonData);
            }

            function onFilter()
            {
                $("#filter_on").addClass('active');
                $("#filter_off").removeClass('active');
                $('#filter_option, #filter_range').show();
                applyFilter();
            }

            function createTable(data){
                var employee_data = '';
                $('#employee_table').html('');
                $.each(data, function(key, value){
                    employee_data += '<tr>';
                    employee_data += '<td><a href="javascript:void(0);" class="edit_player" data-key="'+key+'">'+value.id+'</a></td>'
                    employee_data += '<td>'+value.fname+'</td>'
                    employee_data += '<td>'+value.lname+'</td>'
                    employee_data += '<td>'+value.salary+'</td>'
                    employee_data += '<td>'+value.points+'</td>'
                    employee_data += '<td>'+value.rebounds+'</td>'
                    employee_data += '<td>'+value.assists+'</td>'
                    employee_data += '<td>'+value.steals+'</td>'
                    employee_data += '<td>'+value.blocks+'</td>'
                    employee_data += '<td><a href="javascript:void(0);" class="delete_player" data-key="'+key+'">Delete</a></td>'
                });
                $('#employee_table').append(employee_data);
            }

            function savePlayer()
            {
                var newplayer = {};
                newplayer.fname = $('#firstname').val();
                newplayer.lname = $('#lastname').val();
                newplayer.salary = $('#salary').val();
                newplayer.points = $('#points').val();
                newplayer.rebounds = $('#rebounds').val();
                newplayer.assists = $('#assists').val();
                newplayer.steals = $('#steals').val();
                newplayer.blocks = $('#blocks').val();

                var arrkey = $("#edit_key").val();
                if( $("#action_type").val() == 'edit' && arrkey != ''){
                    jsonData[arrkey].id
                    newplayer.id = jsonData[arrkey].id;
                    jsonData[arrkey] = newplayer;
                }
                else{
                    newplayer.id = id;
                    id++;
                    jsonData.push(newplayer);
                }
                $("#filter_off").click();
                resetForm();
                $('#myModal').modal('hide');
            }

            function sortTable()
            {
                var prop = $("#sorting").val();
                var sorting_type = $("#sorting_type").val();
                results = results.sort(function(a, b) {
                     if (sorting_type == 'asc') return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                     else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                });
                createTable(results);
            }

            function filterBySalaryRange()
            {
                var salary_range = r.getValue();
                var salary_arr = new Array();
                $.each(jsonData, function(key, obj){
                    var salary = formatSalary(obj.salary);

                    if( salary >= salary_range[0] && salary <= salary_range[1] ){
                        salary_arr.push(obj);
                    }
                });
                results = salary_arr;
                sortTable();
            }

            function applyFilter()
            {
                filterBySalaryRange();
                sortTable();
            }

            function formatSalary(salary)
            {
                salary = salary.replace('$','');
                salary = salary.replace(/,/g,'');

                return salary;
            }


            function resetForm()
            {
                //('#playerForm').reset();
                $('#action_type').val('add');
                $('#edit_key').val('');
            }