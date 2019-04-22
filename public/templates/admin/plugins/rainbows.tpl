<form class="form" id="rainbows">
	<button type="button" class="btn btn-success form-control rainbows-save"><i class="fa fa-fw fa-save"></i> Save Settings</button>

	<div class="h1 hidden">
		<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAj5JREFUeNqkVEtrE1EYPZM7j7ya2KaJSW3AWgxiMUWCgojaaLNy4cKVIP0D1a1QUNSfYf+AuBBx3YURdGOTjRu1SogNmATa0OadzON6JtRFi7aKA2eymHse3+NGkVLifx5FZjL/ct4gNMJ1HaJQMNW/IHmIyT04UNFGAh0ch+l+PEpggjg/cp7GLq6giXMQiEBx0x8lME9cQhgD3CL5IvodTWjrCKlrGPeU4FWeHyJwnVjEWUZdwk5nXAxfItp7gZhehyagTwj4p/+YYIG4iwvo8+0peX3WI8yYX5RAH+G5LmI5HfqsQFv9rcAp4h6dBcmdojeEFczYDT1qI3lnADHfRRltveqo0VpLwdLYPgF3PCuseYqx+3QWJCsNX5Ky921UIwP/Z6uXLtZaqa/bmrdnebCU2Sdwg7jKhg1Ys8bYKp1VkgXKEZz40LIX8uX+se6weTIA43SCKQ+UsMxR+dltjQ0zWLPB2DqddZLF4loJcWmZ2Sm0J3U0Do4xTVzmnB2OSme3LYTmDNZsMLZBZ51k7WYC8Ats8ewmsfNry9wnRymDS+LlnH0cVQDxXBDfEU4X6xHGjmdjSJIc4tnXbyvF2tP3q6NLpGY3NvAmlbrG9dS4YZJLIjlntnTW0X84Dhtms+YAYwdJfPjk3Wo9v1kcuT7GM6j5VitSMc0zSlAKpwZ8dCwM/AZk55sMFZrYqpXkMCLletWs3H714NN2b9dd7+7oMvFuuI3wE2OEOGStHcIizD2i+2vzr0D+FGAARenLmDXrT3oAAAAASUVORK5CYII=" width="50px" height="50px"> 
		<b style="color:#ff0000">R</b><b style="color:#ffa500">a</b><b style="color:#ffd700">i</b><b style="color:#00ff00">n</b><b style="color:#00bfff">b</b><b style="color:#0000ff">o</b><b style="color:#8a2be2">w</b><b style="color:#ff00ff">s</b>
	</div>

	<div class="panel panel-success">
		<div class="panel-heading btn btn-success pointer" data-toggle="collapse" data-target=".help">
			<h3 class="panel-title"><i class="fa fa-caret-down pull-right"></i>Help!</h3>
		</div>
		<div class="panel-body collapse help">
			<h4>Manual Usage</h4>
			<p>Surround text with "-= =-" to make rainbows.</p>
			<p><code>-=Rainbow Text=-</code></p>
			<p>Add options with parenthesis like so:</p>
			<p><code>-=(red,yellow,blue,range:3)Rainbow Text=-</code></p>
			<p>Options include:</p>
			<ul>
				<li>Any CSS valid color
					<ul>
						<li>Adds that color to the spectrum used in the rainbow.</li>
					</ul>
				</li>
				<li>range:&#123;number&#125;
					<ul>
						<li>Repeats the spectrum after &#123;number&#125; characters, instead of stretching it over the whole text.</li>
					</ul>
				</li>
				<li>bg:&#123;color&#125;
					<ul>
						<li>Puts a background color &#123;color&#125; behind the text.</li>
					</ul>
				</li>
				<li>theme:&#123;name&#125;
					<ul>
						<li>Uses the theme &#123;name&#125; to make the rainbow. Themes are created below.</li>
					</ul>
				</li>
			</ul>

			<div>Blueberry, blackberry, raspberry, strawberry.</div>

			<div>apple banana cherry date eggfruit fig grapefruit honeydew ilama jambolan kiwi lemon mango nectarine orange pineapple quandong raspberry strawberry tomato umeboshi voavanga watermelon xigua yellow zucchini</div>
		</div>
	</div>

	<div class="panel panel-primary">
		<div class="panel-heading"><span class="panel-title">Posts</span></div>
		<div class="panel-body">
			<div class="form-group">
				<div class="checkbox">
					<label for="postsEnabled">
						<input data-key="postsEnabled" id="postsEnabled" type="checkbox">
						Enable colors in posts.
					</label>
				</div>
				<div class="checkbox">
					<label for="postsModsOnly">
						<input data-key="postsModsOnly" id="postsModsOnly" type="checkbox">
						Only allow moderators to use colors in posts.
					</label>
				</div>
			</div>

			<div class="panel panel-success">
				<div class="panel-heading btn btn-success pointer" data-toggle="collapse" data-target=".themes">
					<h3 class="panel-title"><i class="fa fa-caret-down pull-right"></i>Preset Themes</h3>
				</div>
				<div class="panel-body collapse themes">
					<div class="form-group">
						<span class="theme-label one">Name</span>
						<span class="theme-label">Options</span>
						<div data-key="themes" data-split='<br>' data-attributes='{
							"tagName":"span",
							"class":"theme",
							"data-type":"object",
							"data-split":" ",
							"data-properties":[
								{
									"data-prop":"name"
								},
								{
									"data-prop":"value"
								}
							]}'>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="panel panel-primary">
		<div class="panel-heading"><span class="panel-title">Topic Titles</span></div>
		<div class="panel-body">
			<div class="form-group">
				<div class="checkbox">
					<label for="topicsEnabled">
						<input type="checkbox" data-key="topicsEnabled" id="topicsEnabled" />
						Enable colored topic titles.
					</label>
				</div>
				<div class="checkbox">
					<label for="topicsModsOnly">
						<input type="checkbox" data-key="topicsModsOnly" id="topicsModsOnly" />
						Only allow moderators to use colors in topic titles.
					</label>
				</div>
			</div>
		</div>
	</div>

	<div class="panel panel-primary">
		<div class="panel-heading"><span class="panel-title">Tags</span></div>
		<div class="panel-body">
			<div class="form-group">
				<div class="checkbox">
					<label for="tagsEnabled">
						<input type="checkbox" data-key="tagsEnabled" id="tagsEnabled" />
						Enable colored tags.
					</label>
				</div>
				<div class="checkbox">
					<label for="tagsGradient">
						<input type="checkbox" data-key="tagsGradient" id="tagsGradient" />
						Use gradients in tags.
					</label>
				</div>
				<div>
					<label for="hueModifier">Color Hue Modifier <small>Number 0-360</small></label>
					<input type="number" class="form-control" data-key="hueModifier" id="hueModifier" placeholder="0" min="0" max="360">
				</div>
				<div>
					<label for="lumModifier">Color Brightness Modifier <small>Number 0-80, lower is brighter.</small></label>
					<input type="number" class="form-control" data-key="lumModifier" id="lumModifier" placeholder="0" min="0" max="100">
				</div>
			</div>
		</div>
	</div>
</form>

<script type="text/javascript">
require(['settings'], function(settings) {
	settings.sync('rainbows', $('#rainbows'));
	$('.rainbows-save').click( function (event) {
		settings.persist('rainbows', $('#rainbows'), function(){
			socket.emit('admin.settings.syncRainbows');
		});
	});
});

</script>
