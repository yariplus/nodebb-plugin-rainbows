<form id="rainbows">
    <div class="row">
        <div class="col-lg-9">
            <div class="panel acp-panel-primary">
                <div class="panel-heading">
                    <div class="panel-title">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAj5JREFUeNqkVEtrE1EYPZM7j7ya2KaJSW3AWgxiMUWCgojaaLNy4cKVIP0D1a1QUNSfYf+AuBBx3YURdGOTjRu1SogNmATa0OadzON6JtRFi7aKA2eymHse3+NGkVLifx5FZjL/ct4gNMJ1HaJQMNW/IHmIyT04UNFGAh0ch+l+PEpggjg/cp7GLq6giXMQiEBx0x8lME9cQhgD3CL5IvodTWjrCKlrGPeU4FWeHyJwnVjEWUZdwk5nXAxfItp7gZhehyagTwj4p/+YYIG4iwvo8+0peX3WI8yYX5RAH+G5LmI5HfqsQFv9rcAp4h6dBcmdojeEFczYDT1qI3lnADHfRRltveqo0VpLwdLYPgF3PCuseYqx+3QWJCsNX5Ky921UIwP/Z6uXLtZaqa/bmrdnebCU2Sdwg7jKhg1Ys8bYKp1VkgXKEZz40LIX8uX+se6weTIA43SCKQ+UsMxR+dltjQ0zWLPB2DqddZLF4loJcWmZ2Sm0J3U0Do4xTVzmnB2OSme3LYTmDNZsMLZBZ51k7WYC8Ats8ewmsfNry9wnRymDS+LlnH0cVQDxXBDfEU4X6xHGjmdjSJIc4tnXbyvF2tP3q6NLpGY3NvAmlbrG9dS4YZJLIjlntnTW0X84Dhtms+YAYwdJfPjk3Wo9v1kcuT7GM6j5VitSMc0zSlAKpwZ8dCwM/AZk55sMFZrYqpXkMCLletWs3H714NN2b9dd7+7oMvFuuI3wE2OEOGStHcIizD2i+2vzr0D+FGAARenLmDXrT3oAAAAASUVORK5CYII=" width="50px" height="50px"> 
						<b style="color:#ff0000">R</b><b style="color:#ff6000">a</b><b style="color:#ffbf00">i</b><b style="color:#dfff00">n</b><b style="color:#7fff00">b</b><b style="color:#20ff00">o</b><b style="color:#00bf40">w</b><b style="color:#00609f">s</b>
                    </div>
                </div>
                <div class="panel-body">
				    <h3>Usage</h3>
					<p>
						Surround text with "-= =-"" like so: -=Rainbow Text=-<br>
						Add options in parathesis at the start of the rainbow text like so: -=(red,blue,green)Rainbow Text=-<br>
						Options include any colors, "range:number", "theme:name", and "bg:color".
					</p>
                    <h3>Themes</h3>
                    <p>
                        Format for themes is "name=color,color,color"
                        
                        You can use as many colors as you can imagine. Invalid colors will render text black. You can also use "range:X" in place of a color to tell the plugin to repeat the pattern after X number of characters.
                    </p>
                    <div class="form-group">
                        <div data-key="themes" data-attributes='{"data-type":"input", "style":"width:80%;margin-bottom:10px;"}' data-split="<br>" data-new='' style="width:100%;"></div>
                    </div>
					<div class="form-group">
                        <button type="button" class="btn btn-success form-control" id="save">
                            <i class="fa fa-fw fa-save"></i> Save Themes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>

<script type="text/javascript">

require(['settings'], function(settings) {

    settings.sync('rainbows', $('#rainbows'));
    
    $('#reset').click( function (event) {
        $('#rainbows')[0].reset();
    });
    
    $('#clear').click( function (event) {
        $('#rainbows').find('input').val('');
    });

    $('#save').click( function (event) {
        settings.persist('rainbows', $('#rainbows'), function(){
            socket.emit('admin.settings.syncRainbows');
        });
    });
});

</script>
