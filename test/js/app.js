requirejs.config({
    baseUrl: 'js',
    
    paths: {
        "firebase": "lib/firebase",
        "jquery": "lib/jquery",
        "jquerymobile": "lib/jquerymobile"
    }
});

require(['main'], function(main) {
    main();
});