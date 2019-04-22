#nodebb-plugin-rainbows

Add rainbows to your posts. Smile!

## Install

Install the usual way, either using the ACP "Extend=>Plugins" page or using npm from your NodeBB home directory:

    npm i nodebb-plugin-rainbows

## Usage

Surround text with "-= =-" to make rainbows.

`-=Rainbow Text=-`

Add options with parenthesis like so:

`-=(red,yellow,blue,range:3)Rainbow Text=-`

Options include:

- Any CSS valid color  
  - Adds that color to the spectrum used in the rainbow.  
- range:{number}  
   - Repeats the spectrum after {number} characters, instead of stretching it over the whole text.  
- bg:{color}  
   - Puts a background color {color} behind the text.  
- theme:{name}  
   - Uses the theme {name} to make the rainbow. Themes are created in the ACP.

### Examples

Normal Rainbows:

> `-=Smile! With the power of smiles, the world becomes connected.=-`
> 
> ![](http://puu.sh/jnq17/3c39a1dcb6.png)

Multi-line with options:

> `-=(blue,lightblue,blue,range:12)If you can keep your head when all about you`  
> `Are losing theirs and blaming it on you,`  
> `If you can trust yourself when all men doubt you,`  
> `But make allowance for their doubting too;=-`  
> 
> ![](http://puu.sh/jnqzE/3e8cfceae3.png)

Multi-line with theme and embed link:

> `-=(theme:flutter)Here is a video in the middle of the rainbow`  
> `https://youtu.be/ukCYa6BbyYA`  
> `and the rainbow continues after...=-`  
>
> ![](http://puu.sh/jnqLH/90e45eb1e4.jpg)

## ACP and Themes

Themes are controlled inside the fancy ACP page (*With awesome colored nav!!*):

![](http://puu.sh/jnpTq/ac28a76c8e.png)

## Composer GUI

Composer buttons are added the the default composer and redactor composer. The button opens a GUI for editing your rainbow.

![](http://puu.sh/jGRp0/a8478537f9.png)
