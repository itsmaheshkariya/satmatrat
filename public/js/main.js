// $(document).ready(function() {
//     $('.delete-article').on('click', function(e) {
//         $target = $(e.target);
//         const id = $target.attr('data-id');
//         $.ajax({
//             type: 'DELETE',
//             url: '/' + id,
//             success: function(response) {
//                 alert('Deleting Article');

//             },
//             error: function(err) {
//                 console.log(err);
//             }
//         });
//     });
// });


$(document).ready(function() {
    $('.delete-article').on('click', function(e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/' + id,
            success: function(response) {
                alert('Deleting Article');
                window.location.href = '/'
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
});