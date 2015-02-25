<form id="rainbows">
    <div class="row">
        <div class="col-lg-9">
            <div class="panel acp-panel-primary">
                <div class="panel-heading">
                    <div class="panel-title">
                        <span style="color:#ff0000">R</span><span style="color:#ff6000">a</span><span style="color:#ffbf00">i</span><span style="color:#dfff00">n</span><span style="color:#7fff00">b</span><span style="color:#20ff00">o</span><span style="color:#00bf40">w</span><span style="color:#00609f">s</span> <span style="color:#00609f">S</span><span style="color:#ff0000">e</span><span style="color:#ff6000">t</span><span style="color:#ffbf00">t</span><span style="color:#dfff00">i</span><span style="color:#7fff00">n</span><span style="color:#20ff00">g</span><span style="color:#00bf40">s</span>
                    </div>
                </div>
                <div class="panel-body">
                    <h3>Themes</h3>
                    <p>
                        Format for themes is "name=color,color,color"
                        
                        You can use as many colors as you can imagine. Invalid colors will render text black. Valid options are "repeat:number" and "repeat:every".
                    </p>
                    <div class="form-group">
                        <div data-key="themes" data-attributes='{"data-type":"input", "style":"width:80%;margin-bottom:10px;"}' data-split="<br>" data-new='' style="width:100%;"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-3">
            <div class="panel acp-panel-primary">
                <div class="panel-heading">
                    Action Panel
                </div>

                <div class="panel-body">
                    <div class="form-group">
                        <button type="button" class="btn btn-warning form-control" id="reset">
                            <i class="fa fa-fw fa-history"></i> Reset Settings
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-danger form-control" id="clear">
                            <i class="fa fa-fw fa-times"></i> Clear Settings
                        </button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-success form-control" id="save">
                            <i class="fa fa-fw fa-save"></i> Save Settings
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
