<?php

namespace App\Tests;

use App\Domain\User\UserStorage;
use App\Infrastructure\Fixtures\UserFixtures;
use HWI\Bundle\OAuthBundle\Security\Core\Authentication\Token\OAuthToken;
use function serialize;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

final class SmokeTest extends WebTestCase
{
    public function testGet(): void
    {
        $client = static::createClient();
        $this->logIn($client);

        $client->request('GET', '/');
        $response = $client->getResponse();

        static::assertSame(200, $response->getStatusCode());
    }

    public function testPost(): void
    {
        $client = static::createClient();
        $this->logIn($client);

        $client->request('POST', '/');
        $response = $client->getResponse();

        static::assertSame(200, $response->getStatusCode());
    }

    private function logIn(KernelBrowser $client): void
    {
        /** @var SessionInterface $session */
        $session = self::$container->get('session');
        $user = self::$container->get(UserStorage::class)->getByUsername(UserFixtures::USERNAME);

        $token = new OAuthToken('SomeToken', []);
        $token->setUser($user);
        $token->setAuthenticated(true);

        $session->set('_security_main', serialize($token));
        $session->save();

        $cookie = new Cookie($session->getName(), $session->getId());
        $client->getCookieJar()->set($cookie);
    }
}
