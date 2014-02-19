---
layout: post  
title: "制作自己的Gem"  
category: Ruby  
tags: [ruby,技术]

---

#什么是Gem?


RubyGems是一个方便而强大的Ruby程序包管理器，Ruby的第三方插件是用gem方式来管理，非常容易发布和共享，一个简单的命令就可以安装上第三方的扩展库。特点：能远程安装包，包之间依赖关系的管理，简单可靠的卸载，查询机制，能查询本地和远程服务器的包信息，能保持一个包的不同版本，基于Web的查看接口，能查看你安装的gem的信息。

---

#第一个Gem

我们要创建一个名叫`moondemo`的gem，首先，就要创建一个名字为`moondemo_yourname`的文件夹，这个是为了后面的发布，如果你想发布的话，就要检查一下你的gem名字是否已经被人使用了，如果已经被人使用，那就要换个名字了。    
然后这个文件夹里的基本文件结构应该是这样的。 
 
```
➜  tree  
.  
├── moondemo.gemspec    
├── lib  
│   └── moondemo.rb  

```

gem中的代码被放在`lib`文件夹中，这里有个约定就是`lib`中必须有个和gem同名的ruby文件，这样当`require 'moondemo'`运行的时候，这个gem就会被加载，这个文件就是负责配置你的gem的代码和API。

```
➜  cat lib/moondemo.rb
class moondemo
  def self.hi
    puts "Hello world!"
  end
end

```

而`.gemspec`文件是定义了这个gem的信息，比如是这个gem的功能，作者等，并且当这个gem发布的时候，会将这些信息显示到这个gem的主页上(就像[jekyll](http://rubygems.org/gems/jekyll))。


```
➜  cat moonlitsailor.gemspec
Gem::Specification.new do |s|
  s.name        = 'hola'
  s.version     = '0.0.0'
  s.date        = '2014-02-19'
  s.summary     = "moondemo!"
  s.description = "A simple hello world gem"
  s.authors     = ["sheldon huang"]
  s.email       = 'allenwenzhou@gmail.com'
  s.files       = ["lib/moondemo.rb"]
  s.homepage    =
    'http://rubygems.org/gems/moondemo'
  s.license       = 'MIT'
end

```

这里有很多选项，一看名字就知道他们是要代表什么内容的，如果你还想知道更多就看一些这个[文档](http://guides.rubygems.org/specification-reference/)

当我们创建完成了一个.gemspec,就可以编译出一个gem了，是不是有点小激动啊。但如果想要测试它就必须要在本地安装编译好的gem。

```
➜ gem build moondemo.gemspec
  Successfully built RubyGem
  Name: moondemo
  Version: 0.0.1
  File: moondemo-0.0.1.gem
  
➜ gem install ./moondemo-0.0.1.gem
Successfully installed moondemo-0.0.1
Parsing documentation for moondemo-0.0.1
Installing ri documentation for moondemo-0.0.1
1 gem installed

```

上面这些步骤，只能是在本地已经装好了我们自己的gem，但还没有使用它，
我们需要`require`这个gem然后根据自己定义的方法来使用它。

```

➜ irb
2.0.0-p353 :001 > require 'moondemo'
 => true
2.0.0-p353 :002 > MoonDemo.hi
Hello world!
 => nil
```
现在就可以将你的gem发布到Ruby社区上了，当在发布之前需要将你的帐号安装在电脑上，如果你在RubyGems.org上注册了帐号，那就只需要输入一个命令,再输入自己的密码就可以了

```
➜ curl -u 你的帐号名 https://rubygems.org/api/v1/api_key.yaml > ~/.gem/credentials; chmod 0600 ~/.gem/credentials

Enter host password for user '你的帐号名':

```

一旦你的用户名已经被安装了，就可以直接发布你的gem了。

```
➜ gem push moondemo-0.0.1.gem
Pushing gem to https://rubygems.org...
Successfully registered gem: moondemo (0.0.1)

```
很快的，你的gem就可以被任何人使用了

```
➜ gem install moondemo
Successfully installed moondemo-0.0.1
Parsing documentation for moondemo-0.0.1
1 gem installed

```
用Ruby和RubyGems来分享代码是不是很简单。

---
#包含更多文件

我们以后代码当然不会这么简单，如果代码变得非常多了之后，该怎么办呢，当然是要是要将代码分到不同的文件中了。  
比如我们想在刚才的gem中添加根据不同语言来输出不同语言的"Hello world"。  
我们就可以添加一个`Translator`文件，刚才提到过，gem的根文件是负责加载代码的，所以其他的功能的文件就需要放在`lib`中和gem同名的文件夹中，我们可以这样分:

```
➜ tree
.
├── lib
│   ├── moondemo
│   │   └── translator.rb
│   └── moondemo.rb
├── moondemo-0.0.1.gem

```

`Translator`中的内容是:

```
class Translator
  def initialize(language)
    @language = language
  end

  def hi
    case @language
      when "chinese"
        "你好，世界!"
      else
        "Hello world!"
      end
  end
end

```

所以接下来，`moondemo.rb`中需要加载`Translator`:

```
class MoonDemo
  def self.hi(language = "english")
    translator = Translator.new(language)
    translator.hi
  end
end

```

*注意:每次新建了一个文件夹或者文件，都不要忘记加到.gemspec文件中，就像这样*

```
 s.authors     = ["Sheldon"]
  s.email       = 'allenwenzhou@gmial.com'
  s.files       = ["lib/moondemo.rb","lib/moondemo/translator.rb"]
  
```
*如果没有上面的修改的话，这个新建的文件夹是不会被加载到已安装的gem里的*

让我们再运行一篇

```
➜ irb -Ilib -rmoondemo
2.0.0-p353 :001 > MoonDemo.hi("english")
 => "Hello world!"
2.0.0-p353 :002 > MoonDemo.hi("chinese")
 => "你好，世界!"
 
```












