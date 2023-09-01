<script>
    import PocketBase from 'pocketbase';
    import Gallary from './Gallary.svelte';

    import { onMount } from 'svelte';
    const pb = new PocketBase('https://pocketbase-production-b48b.up.railway.app');
    var listImages = [];

    async function getList() {
     const records = await pb.collection('gifs').getFullList({
        sort: '-created',
        });
    
        return records;
    }
    onMount(() => {
            getList().then((result) => {
            for (let i = 0; i < result.length; i++) {
                if (result[i].file == 1) {
                    let url = pb.files.getUrl(result[i], result[i].file);
                    listImages.push(url);
                } else {
                    for (let j = 0; j < result[i].file.length; j++) {
                        let url = pb.files.getUrl(result[i], result[i].file[j]);
                        listImages.push(url);
                    }
                }
            }

            listImages = listImages
        })
    });
</script>
    
<main>
    <Gallary gap="20" maxColumnWidth="400" loading="eager">
        {#each listImages as img}
        
            <img src={img} alt="img"/> 
        {/each}
    </Gallary>
</main>

    
